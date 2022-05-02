import { useMemo } from "react";
import { getUserInfo } from "../utils";

export default () => {
  return useMemo(() => getUserInfo(), []);
};
