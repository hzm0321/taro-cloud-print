import Taro from "@tarojs/taro";
import { DB_STORE } from "@/constants/database";

/**
 * 查询 store 数据
 */
export const queryStore = () => {
  return Taro.cloud.database().collection(DB_STORE).get();
};
