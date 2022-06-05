import React, { useCallback, useEffect, useState } from "react";
import Router from "tarojs-router-next";
import { View, ScrollView, Text } from "@tarojs/components";
import { Button, Divider, Icon } from "@antmjs/vantui";

import Modal from "@/components/modal";
import Toast from "@/components/toast";
import StoreCard from "@/components/store-card";
import Container from "@/components/container/index";
import Empty from "@/components/empty";
import FileType from "@/components/file-type";
import { getFileMean, inversePrice, lookFile } from "@/utils";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { deleteFiles } from "@/slices/documentSlice";
import { updateStore } from "@/slices/storeSlice";
import { queryOrderPrices } from "@/services";

import styles from "./index.module.less";

interface Props {}

const PrintOption: React.FC<Props> = () => {
  const [
    filesPricesData,
    setFilesPricesData,
  ] = useState<CloudOrderCalcPriceData>({
    totalPrice: 0,
    freightPrice: 0,
    filesPrice: [],
  });
  const dispatch = useAppDispatch();

  const files = useAppSelector((state) => state.document);
  const storeData = useAppSelector((state) => state.store);

  // 初始化商店数据
  useEffect(() => {
    dispatch(updateStore());
  }, []);

  // 更新价格
  useEffect(() => {
    if (files.length && storeData?._id) {
      Toast.loading("加载中...");
      queryOrderPrices({ storeId: storeData._id, files })
        .then((res) => {
          if (res.result.success) {
            setFilesPricesData(res.result.data);
          } else {
            Toast.fail(res.result.msg);
          }
        })
        .finally(() => {
          Toast.hideLoading();
        });
    }
  }, [files, storeData?._id]);

  const toSelectFile = useCallback(() => {
    Router.toSelectFile();
  }, []);

  // 预览文件
  const handleLookFile = useCallback(({ fileId, tempFilePath }) => {
    lookFile({ fileId, filePath: tempFilePath });
  }, []);

  // 编辑打印配置
  const handleEditPrintConfig = useCallback((file) => {
    Router.toFileConfig({ data: file });
  }, []);

  // 删除文件
  const handleDeleteFile = useCallback((file) => {
    Modal({
      title: `是否删除文件${file.fileName}`,
      onOk() {
        dispatch(deleteFiles(file));
      },
    });
  }, []);

  const toPriceList = useCallback(() => {
    Router.toPriceList({ data: storeData });
  }, [storeData]);

  const handleSubmitOrder = async () => {
    // 提交订单前校验
    if (files.length === 0) {
      Toast.fail("请至少添加一个文件");
      return;
    }
    const backResult = await Router.toConfirmOrder({
      data: {
        storeData,
        files,
        orderType: "document",
      },
    });
  };

  return (
    <Container className={styles.wrapper}>
      <StoreCard value={storeData} />
      {files.length ? (
        <ScrollView scrollY className={styles.scroll}>
          {files.map((file, index) => (
            <View key={file.fileId} className={styles.file}>
              <View className={styles.order}>{index + 1}</View>
              <View className={styles.content}>
                <View className={styles.info}>
                  <FileType type={file.fileType} className={styles.type} />
                  <View className={styles.message}>
                    <View className={styles.name}>{file.fileName}</View>
                    <View className={styles.detail}>{getFileMean(file)}</View>
                  </View>
                </View>
                <Divider />
                <View className={styles.operate}>
                  <View className={styles.price}>
                    ¥ {inversePrice(filesPricesData.filesPrice[index] || 0)}
                  </View>
                  <View className={styles.do}>
                    <Icon
                      name="eye-o"
                      style={{ marginRight: "20px" }}
                      onClick={() => handleLookFile(file)}
                    />
                    <Icon
                      name="edit"
                      onClick={() => handleEditPrintConfig(file)}
                    />
                  </View>
                </View>
              </View>
              <View
                className={styles.close}
                onClick={() => handleDeleteFile(file)}
              >
                <Icon name="cross" color="#e6e6e6" />
              </View>
            </View>
          ))}
          <View
            className={`${styles.file} ${styles.add}`}
            onClick={toSelectFile}
          >
            <Icon name="add-o" size="40px" color="#e6e6e6" />
            添加文件
          </View>
        </ScrollView>
      ) : (
        <View className={styles.empty}>
          <Empty
            type="file"
            extra={
              <Button size="small" type="primary" onClick={toSelectFile}>
                立即添加
              </Button>
            }
          />
        </View>
      )}
      <View className={styles.footer}>
        <View className={styles["total-price"]}>
          合计:&nbsp;
          <Text className={styles.price}>
            ¥ {inversePrice(filesPricesData.totalPrice)}{" "}
          </Text>
          {Number(filesPricesData.freightPrice) > 0 && (
            <Text className={styles.freight} onClick={toPriceList}>
              &nbsp;(不满<Text className={styles.price}>¥19</Text>运费
              <Text className={styles.price}>
                ¥{inversePrice(filesPricesData.freightPrice, true)}
              </Text>
              )
            </Text>
          )}
        </View>
        <View className={styles.confirm} onClick={handleSubmitOrder}>
          确认订单
        </View>
      </View>
    </Container>
  );
};

export default PrintOption;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "打印选项",
  backgroundColor: "#f5f6f9",
});
