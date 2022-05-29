import Taro from "@tarojs/taro";
import { FUNCTION_ORDER } from "@/constants/function";

/**
 * 查询我的订单
 */
export const queryMyOrders = ({
  userId,
  orderType,
  isUnfinished,
}: {
  userId: string;
  orderType?: string;
  isUnfinished?: boolean;
}) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_ORDER,
    data: {
      $url: "order/list",
      userId,
      orderType,
      isUnfinished,
    },
  }) as Promise<CloudFunctionResult<CloudOrderListData[]>>;
};

/**
 * 通过订单编号查询订单详情
 * @param outTradeNo
 */
export const queryOrderByOutTradeNo = ({
  outTradeNo,
}: {
  outTradeNo: string;
}) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_ORDER,
    data: {
      $url: "order/detail",
      outTradeNo,
    },
  }) as Promise<CloudFunctionResult<OrderDb>>;
};

/**
 * 确认收货
 * @param orderId
 * @returns {Promise<Taro.cloud.CallFunctionResult>}
 */
export const confirmPrintOrder = ({ orderId }) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_ORDER,
    data: {
      $url: "order/confirmGoods",
      orderId,
    },
  }) as Promise<CloudFunctionResult<{ success: boolean }>>;
};
