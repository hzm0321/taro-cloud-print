import { useMemo } from "react";
import { getUserInfo } from "@/utils";

/**
 * 返回 userInfo 信息
 */
export const useUserInfo = () => {
  return useMemo(() => getUserInfo(), []);
};
