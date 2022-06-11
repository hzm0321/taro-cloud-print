import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Taro from "@tarojs/taro";

import { USER_INFO_STORAGE } from "@/constants/storage";
import { isLogin, wxLogin } from "@/utils";
import Toast from "@/components/toast";
import { fetchLogin } from "@/services/login";

const initialState = () => {
  return Taro.getStorageSync<UserDb>(USER_INFO_STORAGE) || {};
};

export const login = createAsyncThunk("user/login", async () => {
  if (!isLogin()) {
    try {
      Toast.loading("加载中...");
      const loginRes = await wxLogin();
      if (loginRes) {
        const userRes = await fetchLogin(loginRes.userInfo);
        Toast.hideLoading();
        if (userRes.result.success) {
          return userRes.result.data;
        }
      }
      Toast.hideLoading();
    } catch (e) {
      console.error(e);
      Toast.hideLoading();
      Toast.fail("登录失败");
    }
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState: initialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload?._id) {
        Object.assign(state, action.payload);
        Taro.setStorageSync(USER_INFO_STORAGE, action.payload);
      }
    });
  },
});

export default userSlice.reducer;
