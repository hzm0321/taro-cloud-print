import { useMemo } from "react";
import Router from "tarojs-router-next";

/**
 * 接收路由 params 参数
 */
export const useRouteParams = () => {
  return useMemo(() => Router.getParams(), []);
};
