import Taro from "@tarojs/taro";
import React, { useEffect } from "react";
import { Provider } from "react-redux";

import "./utils/fix";
import { store } from "./store";
import { CLOUD_SERVICE } from "../config/env";
import "./app.less";

interface Props {
  children: React.ReactElement;
}

const App: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init({
        traceUser: true,
        env: CLOUD_SERVICE, // 设置云函数调用环境
      });
    }
  });

  return <Provider store={store}>{children}</Provider>;
};

export default App;
