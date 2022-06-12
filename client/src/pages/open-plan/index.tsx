import React, { useCallback, useEffect, useMemo, useState } from "react";
import Container from "@/components/container";
import { View, Image, Text } from "@tarojs/components";
import { Button, Notify, Steps, Tag } from "@antmjs/vantui";
import Taro from "@tarojs/taro";

import Toast from "@/components/toast";
import { queryReleases } from "@/services/open";
import styles from "./index.module.less";

interface Props {}

const technologyList = [
  {
    color: "#3578e5",
    name: "Taro V3",
  },
  {
    color: "#07c160",
    name: "WeCloudbase",
  },
  {
    color: "#61dafb",
    name: "React Hook",
  },
  {
    color: "#764abc",
    name: "Redux Toolkit",
  },
  {
    color: "#294E80",
    name: "TypeScript",
  },
  {
    color: "#001838",
    name: "@antmjs/vantui",
  },
];

const STAR_URL = "https://github.com/hzm0321/taro-cloud-print";
const OpenPlan: React.FC<Props> = () => {
  const [releaseList, setReleaseList] = useState([]);

  useEffect(() => {
    Toast.loading("加载中...");
    queryReleases()
      .then((res) => {
        if (res.result.success) {
          setReleaseList(res.result.data);
        }
      })
      .finally(() => {
        Toast.hideLoading();
      });
  }, []);

  const handleStar = useCallback(() => {
    Taro.setClipboardData({ data: STAR_URL })
      .then(() => {
        Toast.show("复制项目地址成功，请粘贴项目地址到浏览器上访问", {
          duration: 5000,
        });
      })
      .catch(() => {
        Toast.fail("复制失败");
      });
  }, []);

  const renderSteps = useMemo(() => {
    if (releaseList.length) {
      return releaseList.map((item, index) => ({
        text: (
          <View className={styles.text}>
            {item.name}
            <Text className={styles.date}>
              {new Date(item.published_at).toLocaleDateString()}
            </Text>
          </View>
        ),
        desc: <View className={styles.desc}>{item.body}</View>,
        inactiveIcon: "star",
      }));
    }
  }, [releaseList]);

  return (
    <Container padding={false} className={styles.wrapper}>
      <View className={styles.introduce}>
        <View className={styles.title}>taro-cloud-print</View>
        <View className={styles.content}>
          taro-cloud-print 为本项目开源版本，该版本由 hzm0321 开发并维护。
        </View>
        <View className={styles.content}>
          项目主要基于最新的 Taro V3
          框架并结合微信云开发全栈开发的一款微信云打印小程序。
        </View>
        <Button
          color="#36b7ab"
          plain
          round
          className={styles["to-star"]}
          onClick={handleStar}
        >
          收藏项目
        </Button>
        <Image
          className={styles.stars}
          src="https://img.shields.io/github/stars/hzm0321/taro-cloud-print?style=social"
        />
        <Notify id="star" />
      </View>
      <View className={styles.technology}>
        <View className={styles.title}>技术栈</View>
        <View className={styles.content}>
          {technologyList.map(({ color, name }) => (
            <Tag color={color} size="large" className={styles.tag} key={name}>
              {name}
            </Tag>
          ))}
        </View>
      </View>
      <View className={styles.release}>
        <View className={styles.title}>版本发布</View>
        <Steps
          steps={renderSteps}
          active={-1}
          direction="vertical"
          activeColor="#36b7ab"
          className={styles.steps}
        />
      </View>
    </Container>
  );
};

export default OpenPlan;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "开源计划",
  backgroundColor: "#f5f6f9",
});
