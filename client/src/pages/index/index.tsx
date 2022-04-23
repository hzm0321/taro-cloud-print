import { useEffect, useMemo, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import { Grid, GridItem } from "@antmjs/vantui";

import ImgCopy from "../../assets/home/copy.svg";
import ImgDocument from "../../assets/home/document.svg";
import ImgImage from "../../assets/home/image.svg";
import ImgTest from "../../assets/home/test.svg";
import { querySwiper } from "../../services";
import styles from "./index.module.less";
import { GridItemKeys } from "../../constants/global";

interface SwiperType extends CloudDatabase {
  imgSrc: string;
}

const Index = () => {
  const [swiperList, setSwiperList] = useState<SwiperType[]>([]);

  const gridItemList = useMemo(() => {
    const handleItemClick = (key: GridItemKeys) => {
      // 进入入口前校验一遍登录状态
      switch (key) {
        case GridItemKeys.document:
          break;
        default:
          Taro.showToast({ title: "此功能暂未开放, 敬请期待", icon: "none" });
          break;
      }
    };

    const items = [
      {
        key: GridItemKeys.document,
        icon: ImgDocument,
        text: "文档打印",
      },
      {
        key: GridItemKeys.copy,
        icon: ImgCopy,
        text: "复印",
      },
      {
        key: GridItemKeys.photo,
        icon: ImgImage,
        text: "照片打印",
      },
      {
        key: GridItemKeys.text,
        icon: ImgTest,
        text: "实验室",
      },
    ];
    return items.map((item) => ({
      ...item,
      onClick: () => handleItemClick(item.key),
    }));
  }, []);

  useEffect(() => {
    // 请求轮播图数据
    querySwiper().then((res) => {
      setSwiperList(res.data as SwiperType[]);
    });
  }, []);

  return (
    <View className={styles.wrapper}>
      <View className={styles.header}>
        <Swiper
          className={styles.swiper}
          indicatorColor="#999"
          indicatorActiveColor="#36b7ab"
          circular
          indicatorDots
          autoplay
        >
          {swiperList.map(({ _id, imgSrc }) => (
            <SwiperItem key={_id}>
              <View className={styles["swiper-item"]}>
                <Image src={imgSrc} className={styles["swiper-img"]} />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        <Grid border={false}>
          {gridItemList.map(({ key, ...item }) => (
            <GridItem key={key} {...item} />
          ))}
        </Grid>
      </View>

      {/*<Login />*/}
    </View>
  );
};

export default Index;

definePageConfig({
  navigationBarTitleText: "活字印刷云打印",
});
