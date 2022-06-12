import Taro from "@tarojs/taro";
import { FUNCTION_OPEN } from "@/constants/function";

export const queryReleases = () => {
  return Taro.cloud.callFunction({
    name: FUNCTION_OPEN,
    data: {
      $url: "release/list",
    },
  }) as Promise<CloudFunctionResult<CloudReleaseData[]>>;
};
