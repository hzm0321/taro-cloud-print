import React, { useCallback } from "react";
import Taro from "@tarojs/taro";
import Router, { NavigateType } from "tarojs-router-next";
import { NoticeBar, Toast } from "@antmjs/vantui";
import { View, Text, Image } from "@tarojs/components";

import Container from "@/components/container/index";
import ImgWeChat from "@/assets/brand/wechat.svg";
import { uploadFileAndAnalyze, uploadFileToCloud } from "@/services/file";

import styles from "./index.module.less";

interface Props {}

export interface ToFileConfigProps {
  fileId: string;
  number: number;
  tempFilePath: string;
}

const MAX_SIZE = 50; // 支持文件上传的最大大小

const SelectFile: React.FC<Props> = () => {
  // 文件后缀名 大小检查
  const checkFile = ({ name, size }) => {
    // 校验后缀
    const suffixReg = new RegExp(/\.(pdf)$/i);
    if (!suffixReg.test(name)) {
      Toast.fail("请上传目前支持的文件格式");
      return false;
    }

    // 校验大小
    const formatSize = parseInt(size) / 1024 / 1024;
    if (formatSize > MAX_SIZE) {
      Toast.fail(`请上传文件大小小于${MAX_SIZE}M的文件`);
      return false;
    }
    return true;
  };

  const handleWxClick = useCallback(async () => {
    try {
      const fileRes = await Taro.chooseMessageFile({
        count: 1, // 一次只能选择一个文件
        type: "file",
      });

      Toast.loading("文件上传中");
      const file = fileRes.tempFiles[0];
      if (checkFile(file)) {
        const tempFilePath = file.path;
        const fileSystemManager = Taro.getFileSystemManager();
        fileSystemManager.readFile({
          filePath: tempFilePath,
          success() {
            const fileProps = {
              fileType: file.type,
              fileTime: file.time,
              fileName: file.name,
              filePath: tempFilePath,
            };
            uploadFileToCloud(fileProps)
              .then((res) => {
                Toast.loading("文件解析中");
                if (res) {
                  return uploadFileAndAnalyze({
                    ...fileProps,
                    fileId: res.fileID,
                  }).then((v) => {
                    if (v.result.success) {
                      const { fileId, pageSize } = v.result.data;
                      Router.toFileConfig({
                        type: NavigateType.redirectTo,
                        params: {
                          fileId,
                          number: pageSize,
                          tempFilePath,
                        },
                      });
                    }
                  });
                } else {
                  throw new Error("文件上传失败");
                }
              })
              .catch((err) => {
                console.error(err);
                Toast.fail("文件上传失败");
              });
          },
          fail(res) {
            console.error(res);
            Toast.fail("文件读取失败");
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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
              文档打印目前仅支持 <Text className={styles.primary}>pdf</Text>{" "}
              格式，文件大小限制为{" "}
              <Text className={styles.primary}>{MAX_SIZE}M</Text> 以内
            </View>
          }
        />
      </View>

      <View className={styles.select} onClick={handleWxClick}>
        <Image src={ImgWeChat} className={styles.img} />
        <Text>微信聊天文件</Text>
      </View>
    </Container>
  );
};

export default SelectFile;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "选择文件",
  backgroundColor: "#f5f6f9",
});
