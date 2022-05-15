import React from "react";
import { View, Image } from "@tarojs/components";
import { Cell, CellGroup } from "@antmjs/vantui";

import pkg from "../../../package.json";
import Container from "../../components/container";
import styles from "./index.module.less";

interface Props {}

const AboutWe: React.FC<Props> = () => {
  return (
    <Container padding={false} className={styles.wrapper}>
      <View className={styles.logo}>
        <Image src="cloud://test-73xxf.7465-test-73xxf-1302559344/logo/logo.jpg" />
      </View>
      <View className={styles.desc}>活字印刷云打印</View>
      <CellGroup>
        <Cell title="客户服务热线" isLink />
      </CellGroup>
      <View className={styles.footer}>
        <View className={styles.desc}>小程序版本&nbsp;V{pkg.version}</View>
      </View>
    </Container>
  );
};

export default AboutWe;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "关于我们",
  backgroundColor: "#f5f6f9",
});
