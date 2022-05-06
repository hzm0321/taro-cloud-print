import { useMemo } from "react";
import Router from "tarojs-router-next";

/**
 * 接收路由 data 参数
 */
export const useRouteData = <T>() => {
  return useMemo(() => Router.getData<T>(), []);
};
