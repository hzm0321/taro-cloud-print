// 云函数入口文件
const cloud = require("wx-server-sdk");
const TcbRouter = require("tcb-router");
const {
  getDetailById,
  getDetailByUuid,
  saveDetailByUuid,
} = require("./controllers/store");
const {
  getPriceListByStoreId,
  totalPrice,
  withdrawalAble,
  todayPrice,
  pendingPrice,
} = require("./controllers/price");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  event.cloud = cloud;
  const app = new TcbRouter({ event });

  // 商店详情
  app.router("store/detail", getDetailById);
  // 用户根据商店的id查询价格表
  app.router("store/price/list", getPriceListByStoreId);

  // 管理端接口
  app.router("store/manage/detail", getDetailByUuid);
  app.router("store/manage/save", saveDetailByUuid);
  // 查询店铺总销售额
  app.router("price/manage/total", totalPrice);
  // 查询今日销售额和增长率
  app.router("price/manage/total/today", todayPrice);
  // 查询店铺可提现金额
  app.router("price/manage/withdrawal/able", withdrawalAble);
  // 店铺待完成订单金额和数量
  app.router("price/manage/total/pending", pendingPrice);

  return app.serve();
};
