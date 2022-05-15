import { useEffect } from "react";
import Taro from "@tarojs/taro";

export const useEventCenter = (
  eventName: string,
  callback: (...args: any[]) => void,
  options?: {
    once: boolean;
  }
) => {
  useEffect(() => {
    const isOnce = options?.once;
    Taro.eventCenter[isOnce ? "once" : "on"](eventName, callback);
    return () => {
      Taro.eventCenter.off(eventName);
    };
  }, [eventName, callback, options?.once]);
};
