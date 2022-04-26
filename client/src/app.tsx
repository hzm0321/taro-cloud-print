import React, { useEffect } from "react";
import { Provider } from "react-redux";

import Taro from "@tarojs/taro";

import { store } from "./store";
import { TEST_CLOUD_SERVICE } from "./constants/service-prefix";
import "./app.less";

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

  return <Provider store={store}>{children}</Provider>;
};

export default App;
