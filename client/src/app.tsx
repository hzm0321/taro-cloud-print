import React, { useEffect } from "react";
import { View } from "@tarojs/components";
import { Provider } from "react-redux";
import { Dialog, Toast, Button } from "@antmjs/vantui";
import Taro from "@tarojs/taro";

import { store } from "./store";
import { TEST_CLOUD_SERVICE } from "./constants/service-prefix";
import "./app.less";
import "./utils/fix"; // 修复lodash在小程序中不能使用问题

interface Props {
  children: React.ReactElement;
}

const App: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init({
        traceUser: true,
        env: TEST_CLOUD_SERVICE, // 设置云函数调用环境
      });
    }
  });

  return (
    <Provider store={store}>
      <View>
        <Button type="default">默认按钮</Button>
        {children}
        <Toast id="customSelector" />
        <Dialog id="vanDialog" />
      </View>
    </Provider>
  );
};

export default App;
