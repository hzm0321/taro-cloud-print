// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require("tcb-router");
const { addAddress, getAddress, deleteById, updateById } = require("./controllers/address");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  event.cloud = cloud;
  const app = new TcbRouter({ event });

  // 用户地址相关信息
  app.router("address/add", addAddress);
  app.router("address/get", getAddress);
  app.router("address/delete", deleteById);
  app.router("address/update", updateById);

  return app.serve();
}
