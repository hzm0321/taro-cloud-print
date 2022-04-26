import React, { useEffect, useState } from "react";
import { Image, Text, View } from "@tarojs/components";

import ImgEmptyFile from "@/assets/empty/empty-file.svg";
import ImgEmptyLogin from "@/assets/empty/empty-login.svg";
import ImgEmptyAddress from "@/assets/empty/empty-address.svg";
import styles from "./index.module.less";

interface Props {
  imgSrc?: string;
  type?: "file" | "login" | "address";
  text?: string;
  extra?: React.ReactNode;
}

interface EmptyProps {
  imgSrc: string;
  text: string;
}

const EmptyType: {
  [key: string]: EmptyProps;
} = {
  file: {
    imgSrc: ImgEmptyFile,
    text: "您还未添加任何文件",
  },
  login: {
    imgSrc: ImgEmptyLogin,
    text: "登录后查看订单信息",
  },
  address: {
    imgSrc: ImgEmptyAddress,
    text: "暂无收货地址",
  },
};

const Empty: React.FC<Props> = ({ type, imgSrc, text, extra }) => {
  const [currentEmpty, setCurrentEmpty] = useState<EmptyProps>({});

  useEffect(() => {
    if (type && EmptyType[type]) {
      setCurrentEmpty(EmptyType[type]);
    }
  }, [type]);

  return (
    <View className={styles.wrapper}>
      <Image src={imgSrc || currentEmpty.imgSrc} className={styles.img} />
      <Text className={styles.description}>{text || currentEmpty.text}</Text>
      <View className={styles.extra}>{extra}</View>
    </View>
  );
};

export default Empty;
