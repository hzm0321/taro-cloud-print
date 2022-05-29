import React, { useCallback } from "react";
import { View, Image, Text } from "@tarojs/components";
import { Tag } from "@antmjs/vantui";
import { Router } from "tarojs-router-next";

import ImgStore from "@/assets/common/store.svg";

import styles from "./index.module.less";

interface Props {
  value: StoreDb;
  readonly?: boolean;
}

const StoreCard: React.FC<Props> = ({ value = {}, readonly }) => {
  const { name, description, keywords = [] } = value;

  const toDetail = useCallback(() => {
    Router.toStoreDetail({ data: value });
  }, [value]);

  const toPrice = useCallback(() => {
    Router.toPriceList({ data: value });
  }, [value]);

  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <View className={styles.title}>
          <Image src={ImgStore} className={styles.icon} />
          <Text className={styles.name}>{name}</Text>
          <Text className={styles.detail} onClick={toDetail}>
            详情
          </Text>
        </View>
        {!readonly && (
          <View className={styles.price} onClick={toPrice}>
            价格详情
          </View>
        )}
      </View>
      <View className={styles.description}>{description}</View>
      <View className={styles.keywords}>
        {keywords.map((word, index) => (
          <Tag key={index} type="primary">
            {word}
          </Tag>
        ))}
      </View>
    </View>
  );
};

export default StoreCard;
