const { DB_DISPATCHER } = require("../constants/database");

class Dispatcher {
  async getDispatcher(ctx, next) {
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
      const dbRes = await db.collection(DB_DISPATCHER).where({ store_id: storeId }).get();
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

  async addDispatcher(ctx, next) {
    const { _req: { event: { cloud, storeId, name, phone } } } = ctx;
    const db = cloud.database();

    if (!storeId) {
      ctx.body = {
        success: false,
        data: "缺少storeId"
      };
      return;
    }
    try {
      const dbRes = await db.collection(DB_DISPATCHER).add({ data: { store_id: storeId, name, phone } });
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

  async updateDispatcher(ctx, next) {
    const { _req: { event: { cloud, id, name, phone } } } = ctx;
    const db = cloud.database();

    try {
      const dbRes = await db.collection(DB_DISPATCHER).doc(id).update({
        data:{
          name,
          phone
        }
      });
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

  async deleteDispatcher(ctx, next) {
    const { _req: { event: { cloud, id, name, phone } } } = ctx;
    const db = cloud.database();

    try {
      const dbRes = await db.collection(DB_DISPATCHER).doc(id).remove();
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
}

module.exports = new Dispatcher();
