import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Taro from "@tarojs/taro";
import { isArray } from "lodash";

import { TEMP_DOCUMENT_STORAGE } from "@/constants/storage";

// 数据初始化
const initialState = (): TempDocumentStorageType[] => {
  const state = Taro.getStorageSync(TEMP_DOCUMENT_STORAGE) || [];
  if (!isArray(state)) {
    Taro.setStorageSync(TEMP_DOCUMENT_STORAGE, state);
  }
  return state;
};

// 同步数据到本地存储
const syncToStorage = (state: TempDocumentStorageType[]) => {
  Taro.setStorageSync(TEMP_DOCUMENT_STORAGE, state);
};

/**
 * 本地选择的打印文档配置信息操作
 */
export const documentSlice = createSlice({
  name: "document",
  initialState: initialState(),
  reducers: {
    addFiles: (state, action: PayloadAction<TempDocumentStorageType>) => {
      state.unshift(action.payload);
      syncToStorage(state);
    },
    deleteFiles: (state, action: PayloadAction<TempDocumentStorageType>) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      state.splice(index, 1);
      syncToStorage(state);
    },
    updateFiles: (state, action: PayloadAction<TempDocumentStorageType>) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      state[index] = action.payload;
      syncToStorage(state);
    },
    clearFiles: (state) => {
      state.splice(0, state.length);
      syncToStorage(state);
    },
  },
});

export const {
  addFiles,
  deleteFiles,
  updateFiles,
  clearFiles,
} = documentSlice.actions;
export default documentSlice.reducer;
