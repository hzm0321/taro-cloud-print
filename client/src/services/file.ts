import Taro from "@tarojs/taro";
import { getTimeInfo } from "@/utils";
import { USER_INFO_STORAGE } from "@/constants/storage";
import { FUNCTION_FILE } from "@/constants/function";

/**
 * 上传文件到云存储
 * @returns {Promise<Taro.cloud.CallFunctionResult>}
 * @param data
 */
export const uploadFileToCloud = (data: any = {}) => {
  const { fileType, fileTime, fileName, filePath } = data;
  const { _openid: openId } = Taro.getStorageSync<UserDb>(USER_INFO_STORAGE);
  const cloudPath = `printFile/${getTimeInfo()}/${openId}/${fileType}/${fileTime}-${fileName}`;

  return Taro.cloud.uploadFile({
    cloudPath,
    filePath,
  });
};

/**
 * 上传文件到云函数并解析
 * @param data
 * @returns {*}
 */
export const uploadFileAndAnalyze = (data) => {
  return Taro.cloud.callFunction({
    name: FUNCTION_FILE,
    data,
  }) as Promise<CloudFunctionResult<CloudFileParseSuccessData>>;
};
