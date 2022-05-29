declare namespace PrintConfig {
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

// 文件设置类型
declare enum FILE_CONFIG_TYPES {
  SIZE = "size", // 纸张大小
  COLOR = "color", // 纸张颜色
  TYPE = "type", // 纸张类型
  FACE = "face", // 单双面
  COUNT = "count", // 打印份数
  BIND = "bind", // 装订方式
  NUMBER = "number", // 文件页数
  PRICE = "price", // 价格
}

// 文档型打印配置
declare interface DocumentConfigProps {
  [FILE_CONFIG_TYPES.TYPE]: PrintConfig.TYPE | keyof typeof PrintConfig.TYPE;
  [FILE_CONFIG_TYPES.SIZE]: PrintConfig.SIZE | keyof typeof PrintConfig.SIZE;
  [FILE_CONFIG_TYPES.COLOR]: PrintConfig.COLOR | keyof typeof PrintConfig.COLOR;
  [FILE_CONFIG_TYPES.FACE]: PrintConfig.FACE | keyof typeof PrintConfig.FACE;
  [FILE_CONFIG_TYPES.BIND]: PrintConfig.BIND | keyof typeof PrintConfig.BIND;
  [FILE_CONFIG_TYPES.COUNT]: number;
  [FILE_CONFIG_TYPES.NUMBER]: number;
  [FILE_CONFIG_TYPES.PRICE]?: number;
}

// 本地存储的文件配置
declare interface TempDocumentStorageType extends DocumentConfigProps {
  fileId: string;
  fileType: "pdf";
  fileName: string;
  tempFilePath: string;
  id: string;
}
