// 云函数入口文件
const cloud = require("wx-server-sdk");
const TcbRouter = require("tcb-router");
const {
  calcOrderPrice,
  getOrderList,
  getStoreOrderList,
  toPrint,
  toAddDispatcher,
  confirmGoods,
  getOrderDetail,
  toPrinting,
  addTrackNo,
} = require("./controllers/order");
const { getDispatcher, addDispatcher, updateDispatcher, deleteDispatcher } = require("./controllers/dispatcher");
// const router = require("./routers");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  event.cloud = cloud;
  const app = new TcbRouter({ event });

  /********* 小程序端 ***********/
  // 用户提交订单并计算价格
  app.router("order/calcPrice", calcOrderPrice);
  // 用户获取订单列表
  app.router("order/list", getOrderList);
  // 用户确认收货
  app.router("order/confirmGoods", confirmGoods);
  // 查询订单详情
  app.router("order/detail", getOrderDetail);

  /********* 管理端 ***********/
  // 订单列表
  app.router("order/manage/list", getStoreOrderList);
  // 订单打印中
  app.router("order/manage/printing", toPrinting);
  // 订单录入快递单号
  app.router("order/manage/addTrackNo", addTrackNo);
  // 订单文件打印完成
  app.router("order/manage/toPrint", toPrint);
  // 订单添加配送员
  app.router("order/manage/addDispatcher", toAddDispatcher);
  // 配送员列表
  app.router("dispatcher/manage/list", getDispatcher);
  // 添加配送员
  app.router("dispatcher/manage/add", addDispatcher);
  // 编辑配送员
  app.router("dispatcher/manage/update", updateDispatcher);
  // 删除配送员
  app.router("dispatcher/manage/delete", deleteDispatcher);

  return app.serve();
};
