import Taro from "@tarojs/taro";

import { FUNCTION_USERINFO } from "../constants/function";

/**
 * 查询我的地址
 * @param userId
 * @returns {Promise<Taro.cloud.CallFunctionResult>}
 */
export const queryMyAddress = (userId: string) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_USERINFO,
    data: {
      $url: "address/get",
      user_id: userId,
    },
  }) as Promise<CloudFunctionResult<AddressDb[]>>;
};

/**
 * 添加地址
 * @param params
 * @returns {Promise<Taro.cloud.CallFunctionResult>}
 */
export const addAddress = (params: AddressDb) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_USERINFO,
    data: {
      $url: "address/add",
      ...params,
    },
  }) as Promise<CloudFunctionResult<AddressDb>>;
};

/**
 * 更新地址
 * @param params
 * @returns {Promise<Taro.cloud.CallFunctionResult>}
 */
export const updateAddress = (params) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_USERINFO,
    data: {
      $url: "address/update",
      ...params,
    },
  }) as Promise<CloudFunctionResult<AddressDb>>;
};

/**
 * 删除地址
 * @returns {Promise<Taro.cloud.CallFunctionResult>}
 * @param addressId
 */
export const deleteMyAddress = (addressId) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_USERINFO,
    data: {
      $url: "address/delete",
      address_id: addressId,
    },
  }) as Promise<CloudFunctionResult<CloudFunctionResultDelete>>;
};
