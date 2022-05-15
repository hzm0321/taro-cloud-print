import React, { useCallback, useEffect, useState } from "react";
import Router from "tarojs-router-next";
import { View, ScrollView } from "@tarojs/components";
import { Button, Dialog, Divider, Icon } from "@antmjs/vantui";
import Taro from "@tarojs/taro";

import { queryStore } from "@/services";
import StoreCard from "@/components/store-card";
import Container from "@/components/container/index";
import Empty from "@/components/empty";
import FileType from "@/components/file-type";
import {
  TEMP_DOCUMENT_STORAGE,
  TEMP_DOCUMENT_STORAGE_TYPE,
} from "@/constants/storage";
import { getFileMean, lookFile } from "@/utils";
import { useUpdate } from "@/hooks";
import { EVENT_UPDATE_FILE } from "@/constants/events";

import styles from "./index.module.less";

interface Props {}

const PrintOption: React.FC<Props> = () => {
  const [storeData, setStoreData] = useState<StoreDb>({} as StoreDb);
  const update = useUpdate();

  const files = Taro.getStorageSync<TEMP_DOCUMENT_STORAGE_TYPE[]>(
    TEMP_DOCUMENT_STORAGE
  );

  // 初始化商店数据
  useEffect(() => {
    queryStore().then((res) => {
      setStoreData(res.data[0] as StoreDb);
    });
  }, []);

  // 监听文件更新
  useEffect(() => {
    Taro.eventCenter.on(EVENT_UPDATE_FILE, update);
    return () => {
      Taro.eventCenter.off(EVENT_UPDATE_FILE);
    };
  }, []);

  const updateFiles = useCallback((_files) => {
    Taro.setStorageSync(TEMP_DOCUMENT_STORAGE, _files);
    update();
  }, []);

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
    Dialog.confirm({ title: `是否删除文件${file.fileName}` }).then((res) => {
      if (res === "confirm") {
        const newFiles = files.filter((item) => item.id !== file.id);
        updateFiles(newFiles);
      }
    });
  }, []);

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
                  <View className={styles.price}>¥ 1.00</View>
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
        <View className={styles["total-price"]}>合计:</View>
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
