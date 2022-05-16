import React, { useCallback, useEffect, useState } from "react";
import Router from "tarojs-router-next";
import { View, ScrollView, Text } from "@tarojs/components";
import { Button, Divider, Icon } from "@antmjs/vantui";
import Taro from "@tarojs/taro";

import { queryOrderPrices, queryStore } from "@/services";
import StoreCard from "@/components/store-card";
import Container from "@/components/container/index";
import Empty from "@/components/empty";
import FileType from "@/components/file-type";
import {
  TEMP_DOCUMENT_STORAGE,
  TEMP_DOCUMENT_STORAGE_TYPE,
} from "@/constants/storage";
import { getFileMean, inversePrice, lookFile } from "@/utils";
import { useUpdate, useEventCenter } from "@/hooks";
import { EVENT_UPDATE_FILE } from "@/constants/events";
import Modal from "@/components/modal";
import Toast from "@/components/toast";

import styles from "./index.module.less";

interface Props {}

const PrintOption: React.FC<Props> = () => {
  const [storeData, setStoreData] = useState<StoreDb>({} as StoreDb);
  const [totalPrice, setTotalPrice] = useState(0);
  const [freightPrice, setFreightPrice] = useState(0);
  const update = useUpdate();

  const files = initFiles();

  // 监听文件本地缓存变化
  useEventCenter(EVENT_UPDATE_FILE, () => updateFiles(initFiles()));

  // 初始化商店数据
  useEffect(() => {
    queryStore().then((res) => {
      setStoreData(res.data[0] as StoreDb);
    });
  }, []);

  // 初始化价格数据
  useEffect(() => {
    if (storeData._id) {
      updateFiles(files);
    }
  }, [storeData]);

  function initFiles() {
    return Taro.getStorageSync<TEMP_DOCUMENT_STORAGE_TYPE[]>(
      TEMP_DOCUMENT_STORAGE
    );
  }

  // 刷新本地 files 缓存数据
  const updateFiles = useCallback(
    (newFiles) => {
      Toast.loading("加载中...");
      // 查询价格
      queryOrderPrices({ storeId: storeData._id, files: newFiles })
        .then((res) => {
          if (res.result.success) {
            const result = res.result.data;
            const _files = newFiles.map((file, index) => ({
              ...file,
              price: result.filesPrice[index],
            }));
            setTotalPrice(result.totalPrice);
            setFreightPrice(result.freightPrice);
            Taro.setStorageSync(TEMP_DOCUMENT_STORAGE, _files);
            update();
          } else {
            Toast.fail(res.result.msg);
          }
        })
        .finally(() => {
          Toast.hideLoading();
        });
    },
    [update, storeData]
  );

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
  const handleDeleteFile = useCallback(
    (file) => {
      Modal({
        title: `是否删除文件${file.fileName}`,
        onOk() {
          const newFiles = files.filter((item) => item.id !== file.id);
          updateFiles(newFiles);
        },
      });
    },
    [files, updateFiles]
  );

  const toPriceList = useCallback(() => {
    Router.toPriceList({ data: storeData });
  }, [storeData]);

  return (
    <Container className={styles.wrapper}>
      <StoreCard value={storeData} />
      {files.length ? (
        <ScrollView scrollY className={styles.scroll}>
          {files.map((file, index) => (
            <View key={file.fileId} className={styles.file}>
              <View className={styles.order}>{++index}</View>
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
                    ¥ {inversePrice(file.price || 0)}
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
              <View onClick={() => handleDeleteFile(file)}>
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
          <Text className={styles.price}>¥ {inversePrice(totalPrice)} </Text>
          {Number(freightPrice) > 0 && (
            <Text className={styles.freight} onClick={toPriceList}>
              &nbsp;(不满<Text className={styles.price}>¥19</Text>运费
              <Text className={styles.price}>
                ¥{inversePrice(freightPrice, true)}
              </Text>
              )
            </Text>
          )}
        </View>
        <View className={styles.confirm}>确认订单</View>
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
