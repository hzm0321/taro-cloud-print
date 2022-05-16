// 云函数入口文件
const cloud = require("wx-server-sdk");
const { PAY_SUCCESS, SHIPPING_REMINDER } = require("./constants");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  const { msgType, subMsg, templateId, orderId } = event;

  const wxContext = cloud.getWXContext();
  debugger;

  let msgData = {};
  if (msgType === PAY_SUCCESS) {
    // 支付成功
    msgData = {
      touser: wxContext.OPENID,
      templateId,
      page: `pages/order-detail/index?id=${orderId}`,
      data: subMsg,
      // miniprogramState: 'developer' //小程序类型，默认为正式版，这里设置为开发者模式
    };
    debugger;
  } else if (msgType === SHIPPING_REMINDER) {
    // 发货通知
  } else {
    return {
      success: false,
      message: "消息通知类型不存在",
    };
  }

  return await cloud.openapi.subscribeMessage.send(msgData);
};
