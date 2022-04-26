import React, { useCallback } from "react";
import Login from "../../components/login";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";

interface Props {}

const PrintOption: React.FC<Props> = () => {
  const userInfo = Taro.getStorageSync("");

  const _init = useCallback(() => {}, []);

  return (
    <View>
      <Login afterLogin={_init} />
    </View>
  );
};

export default PrintOption;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "打印选项",
  backgroundColor: "#f5f6f9",
});
