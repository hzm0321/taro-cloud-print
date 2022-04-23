import { useEffect, useState } from "react";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import { Grid, GridItem } from "@antmjs/vantui";

import ImgCopy from "../../assets/home/copy.svg";
import ImgDocument from "../../assets/home/document.svg";
import ImgImage from "../../assets/home/image.svg";
import ImgTest from "../../assets/home/test.svg";
import Login from "../../components/login";
import { querySwiper } from "../../services";
import styles from "./index.module.less";

interface SwiperType extends CloudDatabase {
  imgSrc: string;
}

const Index = () => {
  const [swiperList, setSwiperList] = useState<SwiperType[]>([]);

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
          indicatorActiveColor="#333"
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
          <GridItem icon={ImgDocument} text="文档打印" />
          <GridItem icon={ImgCopy} text="复印" />
          <GridItem icon={ImgImage} text="照片打印" />
          <GridItem icon={ImgTest} text="实验室" />
        </Grid>
      </View>

      <Login />
    </View>
  );
};

export default Index;

definePageConfig({
  navigationBarTitleText: "活字印刷云打印",
});
