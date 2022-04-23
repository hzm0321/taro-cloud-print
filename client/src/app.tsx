import React, { useEffect } from "react";
import Taro from "@tarojs/taro";

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

  return children;
};

export default App;
