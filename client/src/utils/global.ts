import Taro from "@tarojs/taro";
import { isEmpty } from "lodash";

import { USER_INFO_STORAGE } from "@/constants/storage";
import { FUNCTION_LOGIN } from "@/constants/function";
import { FILE_CONFIG_MEANING, FILE_CONFIG_TYPES } from "@/constants/common";
import Toast from "@/components/toast";

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
  return !isEmpty(Taro.getStorageSync<UserDb>(USER_INFO_STORAGE));
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
 * @param isInteger
 * @returns {string}
 */
export function inversePrice(price: number = 0, isInteger?: boolean) {
  const v = (price / 100).toFixed(2);
  return isInteger ? parseInt(v).toString() : v;
}

/**
 * 获取打印配置的中文意思
 * @param config
 * @param type
 */
export function getPrintConfigMean(config: string, type: FILE_CONFIG_TYPES) {
  return FILE_CONFIG_MEANING[type][config];
}

/**
 * 获取当前时间戳
 */
export function getTimeInfo() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * 获取格式化后的详细时间
 * @param date
 */
export function getTime(date = new Date()) {
  const y = date.getFullYear();
  let m: string | number = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let d: string | number = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h: string | number = date.getHours();
  h = h < 10 ? "0" + h : h;
  let minute: string | number = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  let second: string | number = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  return y + "年" + m + "月" + d + "日 " + h + ":" + minute + ":" + second;
}

/**
 * 格式化日期
 * @param fmt
 * @param date
 */
export function dateFormat(fmt: string, date: Date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}

/**
 * 根据 fileID 获取文件类型
 * @param fileName
 * @returns {string}
 */
export function getFileType(fileName: string) {
  return fileName.replace(/.+\./, "").toLowerCase();
}

/**
 * 根据 fileID 获取文档类型文件名
 * @param name
 */
export function getFileName(name) {
  const fileSort = "file";
  const originName = name.substr(name.indexOf(fileSort) + fileSort.length + 1);
  const realName = originName.substr(originName.indexOf("-") + 1);
  return realName;
}

interface FileMeanProps extends TempDocumentStorageType {
  [s: string]: any;
}

export function getFileMean(file: FileMeanProps) {
  const number = file[FILE_CONFIG_TYPES.NUMBER];
  const face = file[FILE_CONFIG_TYPES.FACE];
  const count = file[FILE_CONFIG_TYPES.COUNT];
  const realNumber =
    (face === "double" ? Math.ceil(number / 2) : number) * count;
  const getMean = (code: FILE_CONFIG_TYPES) => {
    return getPrintConfigMean(file[code] as string, code);
  };
  return `${getMean(FILE_CONFIG_TYPES.TYPE)}/${
    file[FILE_CONFIG_TYPES.SIZE]
  }/${getMean(FILE_CONFIG_TYPES.COLOR)}/${getMean(FILE_CONFIG_TYPES.FACE)}/${
    file[FILE_CONFIG_TYPES.NUMBER]
  }页/${getMean(FILE_CONFIG_TYPES.BIND)}/${
    file[FILE_CONFIG_TYPES.COUNT]
  }份 共${realNumber}张`;
}

export async function lookFile({
  fileId,
  filePath,
}: {
  fileId?: string;
  filePath?: string;
}) {
  Toast.loading("文件打开中...");
  let _tempFilePath: string = "";
  if (filePath) {
    _tempFilePath = filePath;
  } else if (fileId) {
    const res = await Taro.cloud.downloadFile({ fileID: fileId });
    if (res.tempFilePath) {
      _tempFilePath = res.tempFilePath;
    }
  }
  if (_tempFilePath) {
    Taro.openDocument({
      filePath: _tempFilePath,
    })
      .then(() => {
        Toast.success("文件打开成功");
      })
      .catch(() => {
        Toast.fail("文件打开失败");
      });
  } else {
    Toast.fail("文件打开失败");
  }
}
