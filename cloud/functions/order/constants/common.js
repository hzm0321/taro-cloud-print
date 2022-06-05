// 订单状态
const ORDER_STATUS = {
  WAIT: 1, // 待打印
  PRINTING: 2, // 打印中
  ING_DISPATCH: 3, // 待收货
  WAIT_PICK: 4, // 待自提
  FINISHED: 5, // 已完成
  ING_REFUND: 6, // 退款中
  REJECT_REFUND: 7, // 退款驳回
  FINISHED_REFUND: 8, // 已退款
};

// 文件设置类型
const FILE_CONFIG_TYPES = {
  SIZE: "size", // 纸张大小
  COLOR: "color", // 纸张颜色
  TYPE: "type", // 纸张类型
  FACE: "face", // 单双面
  COUNT: "count", // 打印份数
  BIND: "bind", // 装订方式
  NUMBER: "number", // 文件页数
};

module.exports = { ORDER_STATUS, FILE_CONFIG_TYPES };
