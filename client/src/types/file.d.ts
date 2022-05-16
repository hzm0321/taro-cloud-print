import { FILE_CONFIG_MEANING, FILE_CONFIG_TYPES } from "@/constants/common";

// 文档型打印配置
declare interface DocumentConfigProps {
  [FILE_CONFIG_TYPES.TYPE]: keyof typeof FILE_CONFIG_MEANING[FILE_CONFIG_TYPES.TYPE];
  [FILE_CONFIG_TYPES.SIZE]: keyof typeof FILE_CONFIG_MEANING[FILE_CONFIG_TYPES.SIZE];
  [FILE_CONFIG_TYPES.COLOR]: keyof typeof FILE_CONFIG_MEANING[FILE_CONFIG_TYPES.COLOR];
  [FILE_CONFIG_TYPES.FACE]: keyof typeof FILE_CONFIG_MEANING[FILE_CONFIG_TYPES.FACE];
  [FILE_CONFIG_TYPES.BIND]: keyof typeof FILE_CONFIG_MEANING[FILE_CONFIG_TYPES.BIND];
  [FILE_CONFIG_TYPES.COUNT]: number;
  [FILE_CONFIG_TYPES.NUMBER]: number;
  [FILE_CONFIG_TYPES.PRICE]?: number;
}
