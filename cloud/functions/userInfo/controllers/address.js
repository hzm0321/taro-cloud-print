const { DB_ADDRESS } = require("../constants/database");

/**
 * 用户地址信息
 */
class Address {
  async addAddress(ctx, next) {
    const {
      _req: {
        event: { cloud, area, user_id, consignee, phone, addressDetail },
      },
    } = ctx;
    const db = cloud.database();
    try {
      const res = await db.collection(DB_ADDRESS).add({
        data: {
          user_id,
          consignee,
          phone,
          addressDetail,
          area,
          _updateTime: Date.now(),
          _createTime: Date.now(),
        },
      });
      ctx.body = {
        success: true,
        data: res,
      };
    } catch (err) {
      ctx.body = {
        success: false,
        msg: "数据库操作错误",
      };
      console.error(err);
    }
  }

  async getAddress(ctx, next) {
    const {
      _req: {
        event: { cloud, user_id, area_id },
      },
    } = ctx;
    const db = cloud.database();
    const params = { user_id };
    if (area_id) {
      params.area_id = area_id;
    }

    try {
      const res = await db.collection(DB_ADDRESS).where(params).get();
      ctx.body = {
        success: true,
        data: res.data,
      };
    } catch (err) {
      ctx.body = {
        success: false,
        msg: "数据库操作错误",
      };
      console.error(err);
    }
  }

  async deleteById(ctx, next) {
    const {
      _req: {
        event: { cloud, address_id },
      },
    } = ctx;
    const db = cloud.database();
    try {
      const res = await db.collection(DB_ADDRESS).doc(address_id).remove();
      ctx.body = {
        success: true,
        data: res.stats,
      };
    } catch (err) {
      ctx.body = {
        success: false,
        msg: "数据库操作错误",
      };
      console.error(err);
    }
  }

  async updateById(ctx, next) {
    const {
      _req: {
        event: { cloud, _id, area, user_id, consignee, phone, addressDetail },
      },
    } = ctx;
    const db = cloud.database();
    try {
      const res = await db.collection(DB_ADDRESS).doc(_id).update({
        data: {
          user_id,
          consignee,
          phone,
          addressDetail,
          area,
        },
      });
      ctx.body = {
        success: true,
        data: res.stats,
      };
    } catch (err) {
      ctx.body = {
        success: false,
        msg: "数据库操作错误",
      };
      console.error(err);
    }
  }
}

module.exports = new Address();
