const { DB_STORE } = require("../constants/database");

class Store {
  // 获取某个store详情
  async getDetailById(ctx, next) {
    const { _req: { event: { cloud, storeId } } } = ctx;
    const db = cloud.database();
    try {
      const dbRes = await db.collection(DB_STORE).doc(storeId).get();
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

  // 管理端根据 uuid 获取商店数据
  async getDetailByUuid(ctx, next) {
    const { _req: { event: { cloud, uuid } } } = ctx;
    const db = cloud.database();
    try {
      const dbRes = await db.collection(DB_STORE).where({ uuid }).get();
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

  async saveDetailByUuid(ctx, next) {
    const { _req: { event: { cloud, uuid, saveValues } } } = ctx;
    const db = cloud.database();
    try {
      const dbRes = await db.collection(DB_STORE).where({ uuid }).update({ data: saveValues });
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

module.exports = new Store();
