import { useMemo } from "react";
import Router from "tarojs-router-next";

export default <T>() => {
  return useMemo(() => Router.getData<T>(), []);
};
