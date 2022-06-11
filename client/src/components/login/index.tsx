import React from "react";
import { isFunction } from "lodash";
import { Button } from "@antmjs/vantui";

import { login } from "@/slices/userSlice";
import { useAppDispatch } from "@/hooks";

interface Props {
  afterLogin?: (res) => void;
}

const Login: React.FC<Props> = ({ afterLogin }) => {
  const dispatch = useAppDispatch();

  const getLogin = () => {
    dispatch(login()).then((res) => {
      if (res.payload?._id) {
        isFunction(afterLogin) && afterLogin(res);
      }
    });
  };

  return (
    <Button round type="primary" onClick={getLogin}>
      立即登录
    </Button>
  );
};

export default Login;
