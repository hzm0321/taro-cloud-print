import Taro from "@tarojs/taro";
import { DB_PRICES } from "@/constants/database";

/**
 * 查询 price 数据 by id
 */
export const queryPriceById = (store_id: string) => {
  return Taro.cloud.database().collection(DB_PRICES).where({ store_id }).get();
};
