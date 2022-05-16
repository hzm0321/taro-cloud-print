import Taro from "@tarojs/taro";
import { FUNCTION_SEND_MESSAGE } from "@/constants/function";
import { DB_SUBSCRIBE } from "@/constants/database";

/**
 * 发送支付成功消息通知
 * @param data
 * @returns {*}
 */
export const sendPaySuccessMessage = (data) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_SEND_MESSAGE,
    data,
  });
};

/**
 * 往消息订阅表添加消息
 * @param data
 * @returns {*}
 */
export const addMessage = (data) => {
  return Taro.cloud.database().collection(DB_SUBSCRIBE).add({
    data,
  });
};
