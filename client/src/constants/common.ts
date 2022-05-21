// 文件设置类型
export enum FILE_CONFIG_TYPES {
  SIZE = "size", // 纸张大小
  COLOR = "color", // 纸张颜色
  TYPE = "type", // 纸张类型
  FACE = "face", // 单双面
  COUNT = "count", // 打印份数
  BIND = "bind", // 装订方式
  NUMBER = "number", // 文件页数
  PRICE = "price", // 价格
}

export const FILE_CONFIG_MEANING = {
  [FILE_CONFIG_TYPES.COLOR]: {
    colourless: "黑白",
    colour: "彩色",
  },
  [FILE_CONFIG_TYPES.TYPE]: {
    normal: "普通纸",
    daolin: "护眼道林纸",
  },
  [FILE_CONFIG_TYPES.FACE]: {
    single: "单面",
    double: "双面",
  },
  [FILE_CONFIG_TYPES.BIND]: {
    none: "不装订",
    staple: "订书针装订",
    concave: "凹纹封面无标题",
    concave_title: "凹纹封面有标题",
    old: "复古封面无标题",
  },
  [FILE_CONFIG_TYPES.SIZE]: {
    A3: "A3",
    A4: "A4",
  },
};

// 订单状态
export enum ORDER_STATUS {
  WAIT = 1, // 待打印
  PRINTING, // 打印中
  ING_DISPATCH, // 待收货
  WAIT_PICK, // 待自提
  FINISHED, // 已完成
  ING_REFUND, // 退款中
  REJECT_REFUND, // 退款驳回
  FINISHED_REFUND, // 已退款
}

export const ORDER_STATUS_MEANING = [
  "待支付",
  "待打印",
  "打印中",
  "待收货",
  "待自提",
  "已完成",
  "退款中",
  "拒绝退款",
  "已退款",
];
