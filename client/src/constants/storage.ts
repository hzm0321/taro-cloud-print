// 用户信息
import { FileConfigProps } from "@/pages/file-config";

export const USER_INFO_STORAGE = "userInfo";
export type USER_INFO_STORAGE_TYPE = UserDb;

// 未提交的临时文档信息
export const TEMP_DOCUMENT_STORAGE = "tempDocument";
export type TEMP_DOCUMENT_STORAGE_TYPE = FileConfigProps & {
  number: number;
  fileId: string;
  fileType: "pdf";
  fileName: string;
  tempFilePath: string;
  id: string;
};

// 选择文档打印的商店数据
export const SELECTED_DOCUMENT_STORE_STORAGE = "selectedDocumentStore";
