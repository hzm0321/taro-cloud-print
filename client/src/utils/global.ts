import { isArray } from "lodash";

/**
 * 判断请求云函数或云数据库的结果是否成功
 * @param response
 */
export function getResponse(response: any) {
  // 如果是数据库的请求,并且成功返回
  if (isArray(response?.data)) {
    return true;
  }
  return false;
}
