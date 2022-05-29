export namespace PrintConfig {
  // 纸张颜色
  enum COLOR {
    colourless = "colourless",
    colour = "colour",
  }
  // 单双面
  enum FACE {
    single = "single",
    double = "double",
  }
  // 纸张类型
  enum TYPE {
    normal = "normal",
    daolin = "daolin",
  }
  // 装订类型
  enum BIND {
    none = "none",
    staple = "staple",
    concave = "concave",
    concave_title = "concave_title",
    old = "old",
  }
  // 纸张大小
  enum SIZE {
    A3 = "A3",
    A4 = "A4",
  }
}

export const FILE_CONFIG_MEANING = {
  color: {
    colourless: "黑白",
    colour: "彩色",
  },
  type: {
    normal: "普通纸",
    daolin: "护眼道林纸",
  },
  face: {
    single: "单面",
    double: "双面",
  },
  bind: {
    none: "不装订",
    staple: "订书针装订",
    concave: "凹纹封面无标题",
    concave_title: "凹纹封面有标题",
    old: "复古封面无标题",
  },
  size: {
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

// 订单类型
export enum OrderTypes {
  document = "document",
}

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
