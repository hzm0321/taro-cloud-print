import Taro from "@tarojs/taro";
import { DB_STORE } from "@/constants/database";
import { FUNCTION_STORE } from "@/constants/function";

/**
 * 查询 store 数据
 */
export const queryStore = () => {
  return Taro.cloud.database().collection(DB_STORE).get();
};

/**
 * 通过 id 查询 store 数据
 * @param storeId
 */
export const queryStoreById = (storeId: string) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_STORE,
    data: {
      $url: "store/detail",
      storeId,
    },
  }) as Promise<CloudFunctionResult<StoreDb>>;
};
