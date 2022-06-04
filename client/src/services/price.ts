import Taro from "@tarojs/taro";
import { DB_PRICES } from "@/constants/database";
import { FUNCTION_ORDER } from "@/constants/function";

/**
 * 查询 price 数据 by id
 */
export const queryPriceById = (store_id: string) => {
  return Taro.cloud.database().collection(DB_PRICES).where({ store_id }).get();
};

/**
 * 查询计算订单价格
 * @param storeId
 * @param files
 */
export const queryOrderPrices = ({
  storeId,
  files,
}: {
  storeId: string;
  files: DocumentConfigProps[];
}) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_ORDER,
    data: {
      $url: "order/calcPrice",
      storeId,
      files,
    },
  }) as Promise<CloudFunctionResult<CloudOrderCalcPriceData>>;
};
