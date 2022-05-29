import React from "react";
import { isFunction } from "lodash";
import { Button } from "@antmjs/vantui";

import { mustLogin } from "@/utils";

interface Props {
  afterLogin: () => void;
}

const Login: React.FC<Props> = ({ afterLogin }) => {
  const getLogin = () => {
    mustLogin().then((res) => {
      isFunction(afterLogin) && afterLogin(res);
    });
  };

  return (
    <Button round type="primary" onClick={getLogin}>
      立即登录
    </Button>
  );
};

export default Login;
