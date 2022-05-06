import React, { useMemo } from "react";
import { View, Image, Text, Map } from "@tarojs/components";
import { Rate, Icon, Button } from "@antmjs/vantui";

import Container from "@/components/container/index";
import ImgStore from "@/assets/common/store.svg";
import ImgMapLocation from "@/assets/common/map-location.svg";
import { useRouteData } from "@/hooks";

import styles from "./index.module.less";

interface Props {}

const StoreDetail: React.FC<Props> = () => {
  const storeData = useRouteData() as StoreDb;
  const {
    name,
    rate,
    description,
    officeHours,
    address,
    phone,
    position,
  } = storeData;

  const storeMsgList = useMemo(
    () => [
      {
        icon: "notes-o",
        text: description,
      },
      {
        icon: "clock-o",
        text: `营业时间 ${officeHours}`,
      },
      {
        icon: "location-o",
        text: address,
      },
      {
        icon: "phone-o",
        text: phone,
      },
    ],
    [description, officeHours, address, phone]
  );

  return (
    <Container className={styles.wrapper}>
      <View className={styles.info}>
        <View className={styles.name}>
          <Image src={ImgStore} className={styles["store-icon"]} />
          {name}
          <Rate
            value={rate}
            size={30}
            color="#ffd21e"
            voidIcon="star"
            voidColor="#eee"
            className={styles.rate}
          />
        </View>
        <View className={styles.message}>
          {storeMsgList.map(({ icon, text }, index) => (
            <View key={index}>
              <Icon name={icon} color="#666" className={styles.icon} />
              <Text>{text}</Text>
            </View>
          ))}
        </View>
      </View>
      <View>
        <Map
          {...position}
          className={styles.map}
          markers={[
            {
              ...position,
              iconPath: ImgMapLocation,
            },
          ]}
        />
      </View>
      <Button type="primary" block className={styles.go}>
        前往打印
      </Button>
    </Container>
  );
};

export default StoreDetail;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "商家详情",
  backgroundColor: "#f5f6f9",
});
