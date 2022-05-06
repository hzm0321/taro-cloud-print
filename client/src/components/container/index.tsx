import React, { useEffect } from "react";
import { Dialog, Toast } from "@antmjs/vantui";
import { View } from "@tarojs/components";
import { ViewProps } from "@tarojs/components/types/View";

interface Props extends ViewProps {}

const Container: React.FC<Props> = ({ children, ...rest }) => {
  useEffect(() => {
    Toast.setDefaultOptions({
      duration: 3000,
    });
  }, []);

  return (
    <View {...rest}>
      {children}
      <Toast id="vanToast" />
      <Dialog id="vanDialog" />
    </View>
  );
};

export default Container;
