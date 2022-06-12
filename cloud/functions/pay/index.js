// 云函数入口文件
const cloud = require("wx-server-sdk");
const TcbRouter = require("tcb-router");
const { MCH_Id } = require("./constants/common");
const { unifiedOrder } = require("./controllers/pay");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const mchId = MCH_Id;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  event.cloud = cloud;
  event.openid = wxContext.OPENID;
  event.envId = wxContext.ENV;
  const app = new TcbRouter({ event });

  /****** 小程序端 ******/
  // 发起支付(生成订单)
  app.router("pay/unified", unifiedOrder);

  return app.serve();
};
