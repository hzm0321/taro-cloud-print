// 云函数入口文件
const cloud = require("wx-server-sdk");
const { DB_ORDERS } = require("./constants/database");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const { resultCode, outTradeNo, transactionId } = event;

  const status = resultCode === "SUCCESS" ? 1 : 0;
  const params = {
    status,
    transactionId,
    _updateTime: Date.now()
  };

  if (status === 1) {
    params.histories = [{ _updateTime: Date.now(), status: 1 }];
  }

  try {
    // 判断订单是否为未支付状态
    const dbRes = await db.collection(DB_ORDERS)
      .where({ outTradeNo })
      .get();
    if (dbRes.data[0] && dbRes.data[0].status === 0) {
      await db.collection(DB_ORDERS)
        .where({ outTradeNo })
        .update({
          data: params
        });
    }

    return {
      success: true,
      data: dbRes.data[0]
    };
  } catch (err) {
    return {
      success: false,
      msg: err
    };
  }


};
