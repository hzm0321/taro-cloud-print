import { useCallback, useState } from "react";
import Taro from "@tarojs/taro";
import Router from "tarojs-router-next";
import { View, Image } from "@tarojs/components";
import ImgVip from "@/assets/user/vip.svg";
import { Cell, CellGroup } from "@antmjs/vantui";

import ImgOrder from "@/assets/user/order.svg";
import ImgAbout from "@/assets/user/about.svg";
import ImgAddress from "@/assets/common/address.svg";
import Login from "../../components/login";
import Empty from "../../components/empty";
import { USER_INFO_STORAGE } from "../../constants/storage";
import { isLogin } from "../../utils";
import styles from "./index.module.less";

const User = () => {
  const [userInfo, setUserInfo] = useState(() =>
    Taro.getStorageSync(USER_INFO_STORAGE)
  );

  const _init = useCallback(() => {
    setUserInfo(Taro.getStorageSync(USER_INFO_STORAGE));
  }, []);

  return (
    <View className={styles.wrapper}>
      {isLogin() ? (
        <View className={styles.user}>
          <View className={styles.info}>
            <Image src={userInfo.avatarUrl} className={styles.avatar} />
            <View className={styles.message}>
              <View className={styles.name}>{userInfo.nickName}</View>
              <View className={styles.vip}>
                <Image src={ImgVip} className={styles.icon} />
              </View>
            </View>
            <View className={styles["vip-card"]}>
              <Image src="cloud://test-73xxf.7465-test-73xxf-1302559344/assets/vip-card.jpg" />
            </View>
          </View>
          <View className={styles.content}>
            <View className={styles.operation}>
              <CellGroup inset>
                <Cell
                  title="我的订单"
                  isLink
                  renderIcon={<Image src={ImgOrder} className={styles.icon} />}
                />
                <Cell
                  title="我的地址"
                  isLink
                  renderIcon={
                    <Image src={ImgAddress} className={styles.icon} />
                  }
                />
                <Cell
                  title="关于我们"
                  isLink
                  renderIcon={<Image src={ImgAbout} className={styles.icon} />}
                  onClick={() => Router.toAboutWe()}
                />
              </CellGroup>
            </View>
          </View>
        </View>
      ) : (
        <View className={styles.login}>
          <Empty type="login" extra={<Login afterLogin={_init} />} />
        </View>
      )}
    </View>
  );
};

export default User;

definePageConfig({
  navigationStyle: "custom",
});
