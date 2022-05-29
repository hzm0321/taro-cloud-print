const { ORDER_STATUS } = require("../constants/common");
const { calcOrderPriceUtil } = require("../utils/common");

const { DB_PRICES, DB_STORE, DB_ORDERS } = require("../constants/database");

class Order {
  /**
   * 计算订单价格
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async calcOrderPrice(ctx, next) {
    const {
      _req: {
        event: { cloud, storeId, files },
      },
    } = ctx;
    const db = cloud.database();

    if (!storeId) {
      ctx.body = {
        success: false,
        msg: "缺少storeId",
      };
      return;
    }
    if (!Array.isArray(files) || files.length < 1) {
      ctx.body = {
        success: false,
        msg: "请上传打印文件",
      };
      return;
    }
    // 查询价格表
    const res = await db
      .collection(DB_PRICES)
      // .where({ store_id: storeId })
      .get();

    if (res.data.length > 0) {
      ctx.body = {
        success: true,
        data: calcOrderPriceUtil(files, res.data),
      };
    }
  }

  /**
   * 查询订单详情
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async getOrderDetail(ctx, next) {
    const {
      _req: {
        event: { cloud, outTradeNo },
      },
    } = ctx;
    const db = cloud.database();
    await db
      .collection(DB_ORDERS)
      .where({
        outTradeNo,
        openid: cloud.getWXContext().OPENID,
      })
      .get()
      .then((res) => {
        ctx.body = {
          success: true,
          data: res.data[0],
        };
      })
      .catch((err) => {
        ctx.body = {
          success: false,
          msg: err,
        };
      });
  }

  /**
   * 获取订单列表
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async getOrderList(ctx, next) {
    const {
      _req: {
        event: { cloud, orderType, userId, isUnfinished },
      },
    } = ctx;
    const db = cloud.database();
    const $ = db.command.aggregate;
    const _ = db.command;
    const asName = "orderList";
    const params = { user_id: userId };
    if (orderType && orderType !== "all") {
      params.orderType = orderType;
    }
    try {
      const dbRes = await db
        .collection(DB_ORDERS)
        .aggregate()
        .lookup({
          from: DB_STORE,
          localField: "store_id",
          foreignField: "_id",
          as: asName,
        })
        .replaceRoot({
          newRoot: $.mergeObjects([$.arrayElemAt([`$${asName}`, 0]), "$$ROOT"]),
        })
        .project({
          orderList: 0,
        })
        .match(params)
        .end();
      const unfinishedStatus = [
        ORDER_STATUS.WAIT,
        ORDER_STATUS.PRINTING,
        ORDER_STATUS.ING_DISPATCH,
      ];

      let list = dbRes.list;
      // 只返回未完成的订单
      if (isUnfinished) {
        list = list.filter((v) => unfinishedStatus.includes(v.status));
      }

      ctx.body = {
        success: true,
        data: list,
      };
    } catch (err) {
      console.log(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误",
      };
    }
  }

  async getStoreOrderList(ctx, next) {
    const {
      _req: {
        event: { cloud, storeId, status },
      },
    } = ctx;
    const db = cloud.database();
    try {
      const data = { store_id: storeId };
      if (typeof status === "number") {
        data.status = status;
      }
      const dbRes = await db.collection(DB_ORDERS).where(data).get();
      ctx.body = {
        success: true,
        data: dbRes.data,
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误",
      };
    }
  }

  async toPrint(ctx, next) {
    const {
      _req: {
        event: { cloud, orderId },
      },
    } = ctx;
    const db = cloud.database();
    try {
      const dbRes = await db.collection(DB_ORDERS).doc(orderId).get();
      let status = ORDER_STATUS.WAIT;
      const histories = dbRes.data.histories || [];
      // 如果订单包含地址信息,说明该订单需要配送
      if (dbRes.data.address) {
        status = ORDER_STATUS.PRINTING;
      } else {
        status = ORDER_STATUS.WAIT_PICK;
      }
      histories.push({
        status,
        _updateTime: new Date().getTime(),
      });
      const updateRes = await db.collection(DB_ORDERS).doc(orderId).update({
        data: {
          status,
          histories,
        },
      });

      ctx.body = {
        success: true,
        data: updateRes.data,
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误",
      };
    }
  }

  async toAddDispatcher(ctx, next) {
    const {
      _req: {
        event: { cloud, orderId, dispatcher },
      },
    } = ctx;
    const db = cloud.database();
    try {
      const dbRes = await db.collection(DB_ORDERS).doc(orderId).get();
      let status = ORDER_STATUS.ING_DISPATCH;
      const histories = dbRes.data.histories || [];
      histories.push({
        status,
        _updateTime: new Date().getTime(),
        dispatcher,
      });

      const updateRes = await db.collection(DB_ORDERS).doc(orderId).update({
        data: {
          status,
          histories,
        },
      });

      ctx.body = {
        success: true,
        data: updateRes.data,
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误",
      };
    }
  }

  /**
   * 用户确认订单
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async confirmGoods(ctx, next) {
    const {
      _req: {
        event: { cloud, orderId },
      },
    } = ctx;
    const db = cloud.database();
    try {
      const dbRes = await db.collection(DB_ORDERS).doc(orderId).get();
      if (
        ![ORDER_STATUS.ING_DISPATCH, ORDER_STATUS.WAIT_PICK].includes(
          dbRes.data.status
        )
      ) {
        ctx.body = {
          success: false,
          msg: "订单状态错误",
        };
        return;
      }
      const _ = db.command;
      const updateRes = await db
        .collection(DB_ORDERS)
        .doc(orderId)
        .update({
          data: {
            status: ORDER_STATUS.FINISHED,
            histories: _.push({
              status: ORDER_STATUS.FINISHED,
              _updateTime: new Date().getTime(),
            }),
          },
        });
      if (updateRes.stats.updated === 1) {
        // 记录订单打印状态
        ctx.body = {
          success: true,
          data: "订单状态更新成功",
        };
      } else {
        ctx.body = {
          success: false,
          msg: "订单状态更新失败",
        };
      }
    } catch (err) {
      console.error(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误",
      };
    }
  }

  /**
   * 订单打印中
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async toPrinting(ctx, next) {
    const {
      _req: {
        event: { cloud, orderId },
      },
    } = ctx;
    const db = cloud.database();
    const _ = db.command;
    const dbRes = await db
      .collection(DB_ORDERS)
      .where({ _id: orderId, status: ORDER_STATUS.WAIT })
      .update({
        data: {
          status: ORDER_STATUS.PRINTING,
          histories: _.push({
            status: ORDER_STATUS.PRINTING,
            _updateTime: new Date().getTime(),
          }),
        },
      });
    if (dbRes.stats.updated === 1) {
      // 记录订单打印状态
      ctx.body = {
        success: true,
        msg: "订单状态更新成功",
      };
    }
  }

  /**
   * 订单录入快递单号
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async addTrackNo(ctx, next) {
    const {
      _req: {
        event: { cloud, orderId, trackNo },
      },
    } = ctx;
    const db = cloud.database();
    const _ = db.command;
    const dbRes = await db
      .collection(DB_ORDERS)
      .where({
        _id: orderId,
        status: _.in([ORDER_STATUS.WAIT, ORDER_STATUS.PRINTING]),
      })
      .update({
        data: {
          status: ORDER_STATUS.ING_DISPATCH,
          trackNo,
          histories: _.push({
            status: ORDER_STATUS.ING_DISPATCH,
            trackNo,
            _updateTime: new Date().getTime(),
          }),
        },
      });
    if (dbRes.stats.updated === 1) {
      // 记录订单打印状态
      ctx.body = {
        success: true,
        msg: "快递单号已更新",
      };
    } else {
      ctx.body = {
        success: false,
        msg: "快递单号更新失败",
      };
    }
  }
}

module.exports = new Order();
