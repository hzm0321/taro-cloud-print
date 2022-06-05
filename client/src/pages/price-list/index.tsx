import React, { useEffect, useMemo, useState } from "react";
import { View, Text } from "@tarojs/components";
import { NoticeBar, Row, Col } from "@antmjs/vantui";

import { useRouteData } from "@/hooks";
import Container from "@/components/container/index";
import { getPrintConfigMean, inversePrice } from "@/utils";
import { queryPriceById } from "@/services";
import Toast from "@/components/toast";
import { FILE_CONFIG_MEANING, FILE_CONFIG_TYPES } from "@/constants/common";

import styles from "./index.module.less";

interface Props {}

const PriceList: React.FC<Props> = () => {
  const storeData = useRouteData() as StoreDb;
  const { _id, freight, freightThreshold, name } = storeData;

  const [priceList, setPriceList] = useState<PriceDb[]>([]);

  useEffect(() => {
    if (_id) {
      Toast.loading("加载中...");
      queryPriceById(_id)
        .then((res) => {
          setPriceList(res.data as PriceDb[]);
        })
        .finally(() => {
          Toast.hideLoading();
        });
    }
  }, [_id]);

  const bindPrices = useMemo(() => {
    if (storeData.bindPrices) {
      return Object.keys(storeData.bindPrices)
        .map((key) => ({
          key,
          name: FILE_CONFIG_MEANING[FILE_CONFIG_TYPES.BIND][key],
          price: storeData.bindPrices[key],
        }))
        .sort((a, b) => a.price - b.price);
    }
    return [];
  }, [storeData]);

  return (
    <Container className={styles.wrapper}>
      <View className={styles.tips}>
        <NoticeBar
          color="#666"
          background="#f4fcfb"
          leftIcon="info-o"
          wrapable
          scrollable={false}
          text={
            <View>
              运费说明: 如果单份订单价格不满
              <Text className={styles.price}>
                ¥{inversePrice(freightThreshold)}
              </Text>
              , 则需要额外支付
              <Text className={styles.price}>¥{inversePrice(freight)}</Text>
              运费。
            </View>
          }
        />
      </View>
      <View className={styles.form}>
        <View className={styles.title}>{name}价格表</View>
        <View className={styles.table}>
          <Row className={styles.header}>
            <Col span="6">纸张</Col>
            <Col span="4.5">尺寸</Col>
            <Col span="4.5">颜色</Col>
            <Col span="4.5">单双面</Col>
            <Col span="4.5">单价</Col>
          </Row>
          {priceList.map((item, index) => (
            <Row
              key={item._id}
              className={styles.row}
              style={{ backgroundColor: index % 2 === 0 ? "white" : "#f4fcfb" }}
            >
              <Col span="6">
                {getPrintConfigMean(item.type, FILE_CONFIG_TYPES.TYPE)}
              </Col>
              <Col span="4.5">{item.size}</Col>
              <Col span="4.5">
                {getPrintConfigMean(item.color, FILE_CONFIG_TYPES.COLOR)}
              </Col>
              <Col span="4.5">
                {getPrintConfigMean(item.face, FILE_CONFIG_TYPES.FACE)}
              </Col>
              <Col span="4.5">¥ {inversePrice(item.price)}</Col>
            </Row>
          ))}
        </View>
      </View>
      <View className={styles.form}>
        <View className={styles.title}>装订费用价格表</View>
        <View className={styles.table}>
          <Row className={styles.header}>
            <Col span="12">装订方式</Col>
            <Col span="12">销售价格</Col>
          </Row>
          {bindPrices.map((item) => (
            <Row key={item.key} className={styles.row}>
              <Col span="12">{item.name}</Col>
              <Col span="12">¥ {inversePrice(item.price)}</Col>
            </Row>
          ))}
        </View>
      </View>
    </Container>
  );
};

export default PriceList;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "价格详情",
  backgroundColor: "#f5f6f9",
});
