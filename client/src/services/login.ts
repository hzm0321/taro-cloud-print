import Taro from "@tarojs/taro";
import { FUNCTION_LOGIN } from "@/constants/function";

/**
 * 把用户登录数据写入数据库
 * @param data
 */
export const fetchLogin = (data) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_LOGIN,
    data: {
      userInfo: data,
    },
  }) as Promise<CloudFunctionResult<UserDb>>;
};
