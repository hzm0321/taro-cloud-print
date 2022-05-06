import { useEffect, useMemo, useState } from "react";
import { Router } from "tarojs-router-next";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import { Button, Grid, GridItem, Toast } from "@antmjs/vantui";

import ImgCopy from "@/assets/home/copy.svg";
import ImgDocument from "@/assets/home/document.svg";
import ImgImage from "@/assets/home/image.svg";
import ImgTest from "@/assets/home/test.svg";
import { querySwiper } from "@/services";
import { GridItemKeys } from "@/constants/global";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { incrementByAmount, increment } from "@/slices/counterSlice";
import { mustLogin } from "@/utils";
import Container from "@/components/container";

import styles from "./index.module.less";

interface SwiperType extends CloudDatabase {
  imgSrc: string;
}

const Index = () => {
  const [swiperList, setSwiperList] = useState<SwiperType[]>([]);
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 请求轮播图数据
    querySwiper()
      .then((res) => {
        setSwiperList(res.data as SwiperType[]);
      })
      .catch(() => {
        Toast.fail("轮播图加载失败");
      });
  }, []);

  // 功能入口列表
  const gridItemList = useMemo(() => {
    const handleItemClick = async (key: GridItemKeys) => {
      // 进入入口前校验一遍登录状态
      const loginInfo = await mustLogin();
      if (loginInfo) {
        switch (key) {
          case GridItemKeys.document:
            Router.toPrintOption();
            break;
          default:
            Toast.show("此功能暂未开放, 敬请期待");
            break;
        }
      } else {
        Toast.show("此功能需登录后访问");
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

  return (
    <Container className={styles.wrapper}>
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
      {count}
      <Button
        onClick={() => {
          dispatch(increment());
        }}
      >
        click
      </Button>
      <Button
        onClick={() => {
          dispatch(incrementByAmount(2));
        }}
      >
        click2
      </Button>
      {/*<Login />*/}
    </Container>
  );
};

export default Index;

definePageConfig({
  navigationBarTitleText: "活字印刷云打印",
});
