/// <reference types="@tarojs/taro" />

declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV:
      | "weapp"
      | "swan"
      | "alipay"
      | "h5"
      | "rn"
      | "tt"
      | "quickapp"
      | "qq"
      | "jd";
  }
}

// 云数据库包含的基础字段
declare interface CloudDatabase {
  readonly _id: string;
  _createTime: Date;
  _updateTime: Date;
}

type CloudFunctionResultSuccess<T> = {
  success: true;
  data: T;
};

type CloudFunctionResultFail = {
  success: false;
  message: string;
};

// 云函数返回内容
declare interface CloudFunctionResult<T> extends TaroGeneral.CallbackResult {
  result: CloudFunctionResultSuccess<T> | CloudFunctionResultFail;
}

// users 表字段
declare interface UserDb extends CloudDatabase {
  _openid: string;
  avatarUrl: string;
  city: string;
  country: string;
  gender: number;
  language: string;
  nickName: string;
  province: string;
}
