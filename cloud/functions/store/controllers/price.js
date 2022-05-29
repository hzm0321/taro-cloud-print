const moment = require("moment");
const { DB_PRICES, DB_ORDERS, DB_WITHDRAWAL } = require("../constants/database");
const { ORDER_STATUS } = require("../constants/common");

// 可计算销售额的状态
const CALC_AMOUNT_STATUS = [ORDER_STATUS.WAIT, ORDER_STATUS.WAIT_DISPATCH, ORDER_STATUS.ING_DISPATCH, ORDER_STATUS.WAIT_PICK, ORDER_STATUS.FINISHED];
// 待完成的状态
const PENDING_AMOUNT_STATUS = [ORDER_STATUS.WAIT, ORDER_STATUS.WAIT_DISPATCH, ORDER_STATUS.ING_DISPATCH, ORDER_STATUS.WAIT_PICK];

class getPriceListByStoreId {
  async getPriceListByStoreId(ctx, next) {
    const { _req: { event: { cloud, storeId } } } = ctx;
    const db = cloud.database();
    if (!storeId) {
      ctx.body = {
        success: false,
        data: "缺少storeId"
      };
      return;
    }
    try {
      const dbRes = await db.collection(DB_PRICES).where({ store_id: storeId }).get();
      ctx.body = {
        success: true,
        data: dbRes.data
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误"
      };
    }
  }

  // 订单总金额
  async totalPrice(ctx, next) {
    const { _req: { event: { cloud, storeId } } } = ctx;
    const db = cloud.database();
    const $ = db.command.aggregate;
    const _ = db.command;

    if (!storeId) {
      ctx.body = {
        success: false,
        data: "缺少storeId"
      };
      return;
    }
    try {
      const dbRes = await db.collection(DB_ORDERS).aggregate().match({
        status: _.in(CALC_AMOUNT_STATUS),
        store_id: storeId
      }).group({
        _id: null,
        totalPrice: $.sum("$totalFee")
      }).end();

      ctx.body = {
        success: true,
        data: {
          totalPrice: dbRes.list.length === 1 ? dbRes.list[0].totalPrice : 0
        }
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误"
      };
    }
  }

  async todayPrice(ctx, next) {
    const { _req: { event: { cloud, storeId } } } = ctx;
    const db = cloud.database();
    const $ = db.command.aggregate;
    const _ = db.command;

    if (!storeId) {
      ctx.body = {
        success: false,
        data: "缺少storeId"
      };
      return;
    }

    try {
      // 今日时间
      const nowDate = moment().format("YYYY-MM-DD");
      const todayTime = moment(nowDate).toDate().getTime();
      const tomorrowTime = moment(nowDate).add(1, "days").toDate().getTime();
      const yesterdayTime = moment(nowDate).subtract(1, "days").toDate().getTime();

      let todayAmount = 0;
      let yesterdayAmount = 0;

      // 今日销售额度
      const todayRes = await db.collection(DB_ORDERS).aggregate().match({
        status: _.in(CALC_AMOUNT_STATUS),
        store_id: storeId,
        _createTime: _.gte(todayTime).lte(tomorrowTime)
      }).group({
        _id: null,
        totalPrice: $.sum("$totalFee")
      }).end();


      // 与昨日比较
      const yesterdayRes = await db.collection(DB_ORDERS).aggregate().match({
        status: _.in(CALC_AMOUNT_STATUS),
        store_id: storeId,
        _createTime: _.gte(yesterdayTime).lte(todayTime)
      }).group({
        _id: null,
        totalPrice: $.sum("$totalFee")
      }).end();

      todayAmount = todayRes.list.length === 1 ? todayRes.list[0].totalPrice : 0;
      yesterdayAmount = yesterdayRes.list.length === 1 ? yesterdayRes.list[0].totalPrice : 0;

      let compare = 0;
      if (yesterdayAmount !== 0) {
        compare = (((todayAmount - yesterdayAmount) / yesterdayAmount) * 100).toFixed(2);
      } else if (todayAmount === 0 && yesterdayAmount === 0) {
        compare = parseFloat("0").toFixed(2);
      } else {
        compare = parseFloat("100").toFixed(2);
      }

      ctx.body = {
        success: true,
        data: {
          totalPrice: todayAmount,
          compare
        }
      };

    } catch (err) {
      console.error(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误"
      };
    }
  }

  async withdrawalAble(ctx, next) {
    const { _req: { event: { cloud, storeId } } } = ctx;
    const db = cloud.database();
    const $ = db.command.aggregate;
    if (!storeId) {
      ctx.body = {
        success: false,
        data: "缺少storeId"
      };
      return;
    }
    try {
      // 查出订单总价
      const totalRes = await db.collection(DB_ORDERS).aggregate().match({
        status: ORDER_STATUS.FINISHED,
        store_id: storeId
      }).group({
        _id: null,
        totalPrice: $.sum("$totalFee")
      }).end();
      let totalPrice = 0;
      if (totalRes.list.length === 1) {
        totalPrice = totalRes.list[0].totalPrice || 0;
      }

      // 查出已提现总价
      const withdrawalRes = await db.collection(DB_WITHDRAWAL).aggregate().match({
        store_id: storeId
      }).group({
        _id: null,
        withdrawalPrice: $.sum("$withdrawal_price")
      }).end();

      let withdrawalPrice = 0;
      if (withdrawalRes.list.length === 1) {
        withdrawalPrice = withdrawalRes.list[0].withdrawalPrice || 0;
      }

      const withdrawalAble = totalPrice - withdrawalPrice;

      ctx.body = {
        success: true,
        data: {
          withdrawalAble
        }
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误"
      };
    }
  }

  async pendingPrice(ctx, next) {
    const { _req: { event: { cloud, storeId } } } = ctx;
    const db = cloud.database();
    const $ = db.command.aggregate;
    const _ = db.command;
    if (!storeId) {
      ctx.body = {
        success: false,
        data: "缺少storeId"
      };
      return;
    }
    try {
      // 查询待完成总金额
      const dbRes = await db.collection(DB_ORDERS).aggregate().match({
        status: _.in(PENDING_AMOUNT_STATUS),
        store_id: storeId
      }).group({
        _id: null,
        totalPrice: $.sum("$totalFee"),

      }).end();
      // 查询待完成订单数量
      const pendingRes = await db.collection(DB_ORDERS).where({
        status: _.in(PENDING_AMOUNT_STATUS),
      }).count();
      console.log(pendingRes)

      ctx.body = {
        success: true,
        data: {
          totalPrice: dbRes.list.length === 1 ? dbRes.list[0].totalPrice : 0,
          pendingCount: pendingRes.total
        }
      };
    } catch (err) {
      console.error(err);
      ctx.body = {
        success: false,
        msg: "数据库执行错误"
      };
    }
  }
}

module.exports = new getPriceListByStoreId();
