import React, { useMemo } from "react";
import classnames from "classnames";
import { View } from "@tarojs/components";
import { ViewProps } from "@tarojs/components/types/View";

import styles from "./index.module.less";

interface Props extends ViewProps {
  padding?: boolean;
  layout?: "horizontal" | "vertical";
}

const Container: React.FC<Props> = ({
  padding = true,
  children,
  className,
  layout = "vertical",
  ...rest
}) => {
  const _className = useMemo(() => {
    const args = {
      [styles.container]: true,
    };
    if (className) {
      args[className] = true;
    }
    if (padding) {
      args[styles.padding] = true;
    }
    if (layout === "vertical") {
      args[styles.vertical] = true;
    }
    return classnames(args);
  }, [className, padding, layout]);

  return (
    <View className={_className} {...rest}>
      {children}
    </View>
  );
};

export default Container;
