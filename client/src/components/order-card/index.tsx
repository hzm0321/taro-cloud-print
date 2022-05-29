import React, { useCallback } from "react";
import { View, Text, Image } from "@tarojs/components";
import { Button, Cell, CellGroup } from "@antmjs/vantui";
import Router from "tarojs-router-next";

import { ORDER_STATUS_MEANING } from "@/constants/common";
import FileType from "@/components/file-type";
import { inversePrice } from "@/utils";
import ImgStore from "@/assets/common/store.svg";

import styles from "./index.module.less";

interface Props {
  value: CloudOrderListData;
}

const OrderCard: React.FC<Props> = ({ value }) => {
  const {
    status = 0,
    outTradeNo,
    files = [],
    totalFee,
    name: storeName,
  } = value;

  const toOrderDetail = useCallback(() => {
    Router.toOrderDetail({ params: { outTradeNo } });
  }, []);

  return (
    <CellGroup className={styles.card}>
      <Cell
        title={ORDER_STATUS_MEANING[status]}
        renderExtra={<Text className={styles.no}>订单号：{outTradeNo}</Text>}
      />
      {files.map((file) => (
        <Cell
          key={file.id}
          renderTitle={
            <View className={styles.title}>
              <FileType type={file.fileType} className={styles["file-icon"]} />
              {file.fileName}
            </View>
          }
          renderExtra={
            <Text className={styles.price}>¥ {inversePrice(file.price)}</Text>
          }
        />
      ))}
      <Cell
        value={
          <View>
            实付价格:&nbsp;
            <Text className={styles.price}>¥ {inversePrice(totalFee)}</Text>
          </View>
        }
      />
      <Cell
        renderTitle={
          <View className={styles["store-name"]}>
            <Image src={ImgStore} className={styles.icon} />
            {storeName}
          </View>
        }
        renderExtra={
          <Button
            type="primary"
            size="small"
            round
            className={styles.detail}
            onClick={toOrderDetail}
          >
            订单详情
          </Button>
        }
      />
    </CellGroup>
  );
};

export default OrderCard;
