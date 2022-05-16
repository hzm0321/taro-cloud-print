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
  msg: string;
};

// 云函数返回内容
declare interface CloudFunctionResult<T> extends TaroGeneral.CallbackResult {
  result: CloudFunctionResultSuccess<T> | CloudFunctionResultFail;
}

// 云数据库删除返回的内容
declare interface CloudFunctionResultDelete {
  removed: number;
}

// file 解析成功
declare interface CloudFileParseSuccessData {
  fileId: string;
  pageSize: number;
}

// 订单价格计算
declare interface CloudOrderCalcPriceData {
  totalPrice: number; // 总价格
  freightPrice: number; // 运费价格
  filesPrice: number[]; // 每项订单计算后的价格
}
