// const cloud = require("wx-server-sdk");
// cloud.init();
// const db = cloud.database();
const { PAY_ENV } = require("../constants/env");
const { MCH_Id } = require("../constants/common");
const { DB_ORDERS, DB_USERS } = require("../constants/database");
const { getTime } = require("../utils/common");
const mchId = MCH_Id;

// 测试人员的 openId
const TestMemberOpenid = ["oQ5_Y5XtPLIpK9DioyxVBP-XrWEE"];

class Pay {
  /**
   * 生成订单
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async unifiedOrder(ctx, next) {
    const {
      _req: {
        event: {
          cloud,
          openid,
          storeId,
          files,
          userId,
          orderType,
          address,
          remark,
        },
      },
    } = ctx;
    const db = cloud.database();
    // 订单号
    const nonceStr = Math.random().toString(36).substr(2, 13);
    const timeStamp = getTime() + "";
    const _random = Math.floor(Math.random() * 4000 + 1000);
    const outTradeNo = `P${timeStamp}${_random}`;
    // 描述
    const body = "打印订单";
    const tradeType = "JSAPI";
    let totalPrice = 0;
    const envId = PAY_ENV;

    // 计算价格
    const priceRes = await cloud.callFunction({
      name: "order",
      data: {
        $url: "order/calcPrice",
        storeId,
        files,
      },
    });
    if (priceRes.result.success) {
      totalPrice = priceRes.result.data.totalPrice;
      // 验证访问用户是否为管理员，管理员测试时修改价格为 1分
      const userRes = await cloud
        .database()
        .collection(DB_USERS)
        .where({ _openid: openid, testFlag: true })
        .get();
      if (userRes.data && userRes.data.length > 0) {
        totalPrice = 1;
      }
      // 把价格写入文件行数据
      files.forEach((file, index) => {
        file.price = priceRes.result.data.filesPrice[index];
      });
    } else {
      ctx.body = {
        success: false,
        msg: "支付价格计算失败",
      };
      return;
    }

    // 发起支付
    const result = await cloud.cloudPay.unifiedOrder({
      body,
      envId,
      subMchId: mchId,
      nonceStr,
      outTradeNo,
      tradeType,
      spbillCreateIp: "127.0.0.1",
      totalFee: totalPrice,
      functionName: "paySuccess",
    });

    console.log(result);

    if (result.payment) {
      // 记录预支付交易单信息
      const dbRes = await db.collection(DB_ORDERS).add({
        data: {
          openid,
          store_id: storeId,
          user_id: userId,
          files,
          body,
          outTradeNo,
          totalFee: totalPrice, // 支付的价格 单位/分
          status: 0,
          orderType,
          address,
          remark,
          _createTime: Date.now(),
          _updateTime: Date.now(),
        },
      });
      console.log(dbRes);
      ctx.body = {
        success: true,
        data: { ...result, outTradeNo, totalPrice, orderId: dbRes._id },
      };
    } else {
      ctx.body = {
        success: false,
        msg: "发起支付失败",
      };
    }
  }
}

module.exports = new Pay();
