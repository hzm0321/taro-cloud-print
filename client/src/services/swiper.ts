import Taro from "@tarojs/taro";

import { DB_SWIPER } from "@/constants/database";

/**
 * 查询轮播图
 * @returns {Promise<Taro.DB.Query.IQueryResult>}
 */
export const querySwiper = () => {
  return Taro.cloud.database().collection(DB_SWIPER).get();
};
