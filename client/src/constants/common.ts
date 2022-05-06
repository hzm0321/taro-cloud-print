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
