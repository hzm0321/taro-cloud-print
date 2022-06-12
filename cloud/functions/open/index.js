// 云函数入口文件
const cloud = require("wx-server-sdk");
const TcbRouter = require("tcb-router");

const { releaseList } = require("./controllers/release");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  event.cloud = cloud;
  const app = new TcbRouter({ event });

  // 查看 taro-cloud-print release 数据
  app.router("release/list", releaseList);

  return app.serve();
};
