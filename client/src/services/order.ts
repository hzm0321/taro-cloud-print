import Taro from "@tarojs/taro";
import { FUNCTION_ORDER } from "@/constants/function";
import { CloudFunctionResult, CloudOrderListData } from "@/types/function";

/**
 * 查询我的订单
 */
export const queryMyOrders = ({ userId }: { userId: string }) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_ORDER,
    data: {
      $url: "order/list",
      userId,
    },
  }) as Promise<CloudFunctionResult<CloudOrderListData[]>>;
};
