import { View } from "@tarojs/components";

import styles from "./index.module.less";

const User = () => {
  return <View className={styles.wrapper}>111</View>;
};

export default User;

definePageConfig({
  navigationStyle: "custom",
});
