import Taro from "@tarojs/taro";
import { FUNCTION_PAY } from "@/constants/function";

/**
 * 查询计算订单价格
 * @param data
 */
export const requestPay = (data) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_PAY,
    data: {
      $url: "pay/unified",
      ...data,
    },
  }) as Promise<CloudFunctionResult<CloudPaymentData>>;
};
