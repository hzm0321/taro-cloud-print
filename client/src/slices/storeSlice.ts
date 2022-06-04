import Taro from "@tarojs/taro";
import { createSlice } from "@reduxjs/toolkit";

import { SELECTED_DOCUMENT_STORE_STORAGE } from "@/constants/storage";
import { queryStore } from "@/services";

const initialState = () => {
  return Taro.getStorageSync(SELECTED_DOCUMENT_STORE_STORAGE) || {};
};

/**
 * 用户当前选择的打印商店数据
 */
export const storeSlice = createSlice({
  name: "store",
  initialState: initialState(),
  reducers: {
    updateStore: (state) => {
      queryStore().then((res) => {
        // 目前暂未开发一对多商家模式,仅选取首条商家数据
        if (res?.data[0]) {
          const store = res.data[0];
          Taro.setStorageSync(SELECTED_DOCUMENT_STORE_STORAGE, store);
          state = store;
        }
      });
    },
  },
});

export const { updateStore } = storeSlice.actions;
export default storeSlice.reducer;
