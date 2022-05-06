import Taro from "@tarojs/taro";
import { Toast } from "@antmjs/vantui";
import { isEmpty } from "lodash";

import { USER_INFO_STORAGE } from "@/constants/storage";
import { FUNCTION_LOGIN } from "@/constants/function";
import { FILE_CONFIG_MEANING, FILE_CONFIG_TYPES } from "@/constants/common";

const app = Taro.getApp();

// 获取系统信息
export const systemInfo = Taro.getSystemInfoSync();
// 胶囊按钮位置信息
const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();

// 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
export const navBarHeight =
  (menuButtonInfo.top - systemInfo.statusBarHeight!) * 2 +
  menuButtonInfo.height +
  systemInfo.statusBarHeight!;
// 胶囊距右方间距（方保持左、右间距一致）
export const menuRight = systemInfo.screenWidth - menuButtonInfo.right;
// 胶囊距底部间距（保持底部间距一致）
export const menuBottom = menuButtonInfo.top - systemInfo.statusBarHeight!;
// 胶囊高度（自定义内容可与胶囊高度保证一致）
export const menuHeight = menuButtonInfo.height;

/**
 * 获取当前用户登录信息
 */
export const getUserInfo = () => {
  const userInfo = Taro.getStorageSync<UserDb>(USER_INFO_STORAGE);
  if (userInfo) {
    return userInfo;
  } else {
    return null;
  }
};

/**
 * 检查是否登录
 */
export const isLogin = () => {
  return !isEmpty(Taro.getStorageSync(USER_INFO_STORAGE));
};

/**
 * 微信登录
 */
export const wxLogin = () => {
  return Taro.getUserProfile({
    desc: "用于绑定打印账户用户信息",
  });
};

/**
 * 未登录则发起登录
 */
export const mustLogin = async () => {
  const cloud = Taro.cloud;
  let userInfo = {} as UserDb;

  const _isLogin = isLogin();
  if (!_isLogin) {
    try {
      Toast.loading("加载中...");
      const loginRes = await wxLogin();
      if (loginRes) {
        const userRes = (await cloud.callFunction({
          name: FUNCTION_LOGIN,
          data: {
            userInfo: loginRes.userInfo,
          },
        })) as CloudFunctionResult<UserDb>;
        if (userRes.result.success) {
          userInfo = userRes.result.data;
        }
        // 全局数据存入登录状态
        Taro.setStorageSync(USER_INFO_STORAGE, userInfo);
        Toast.clear();
        return userInfo;
      }
    } catch (e) {
      console.error(e);
      Toast.clear();
      return false;
    }
  }
  return true;
};

/**
 * 判断请求云函数或云数据库的结果是否成功
 * @param response
 */
export function getResponse<T>(response: CloudFunctionResult<T>) {
  if (response.result.success) {
    return response.result as CloudFunctionResultSuccess<T>;
  }
  return response.result as CloudFunctionResultFail;
}

/**
 * 格式化区域信息
 * @param data
 * @returns {*}
 */
export function formatArea(data: Area[] = []) {
  return data?.map((v) => v.name).join("-");
}

/**
 * 格式化价格
 * @param price
 * @returns {number}
 */
export function formatPrice(price: number) {
  return price * 100;
}

/**
 * 还原价格
 * @param price
 * @returns {string}
 */
export function inversePrice(price: number) {
  return (price / 100).toFixed(2);
}

/**
 * 获取打印配置的中文意思
 * @param config
 * @param type
 */
export function getPrintConfigMean(config: string, type: FILE_CONFIG_TYPES) {
  return FILE_CONFIG_MEANING[type][config];
}
