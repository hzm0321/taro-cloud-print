import Taro from "@tarojs/taro";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { SELECTED_DOCUMENT_STORE_STORAGE } from "@/constants/storage";
import { queryStore } from "@/services";

const initialState = () => {
  return Taro.getStorageSync(SELECTED_DOCUMENT_STORE_STORAGE) || {};
};

export const updateStore = createAsyncThunk("store/update", queryStore);

/**
 * 用户当前选择的打印商店数据
 */
export const storeSlice = createSlice({
  name: "store",
  initialState: initialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateStore.fulfilled, (state, action) => {
      // 目前暂未开发一对多商家模式,仅选取首条商家数据
      if (action.payload?.data[0]) {
        const store = action.payload.data[0];
        Taro.setStorageSync(SELECTED_DOCUMENT_STORE_STORAGE, store);
        Object.assign(state, store);
      }
    });
  },
});

// export const { updateStore } = storeSlice.actions;
export default storeSlice.reducer;
