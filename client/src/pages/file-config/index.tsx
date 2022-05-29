import React, { useCallback, useEffect, useMemo, useState } from "react";
import Router from "tarojs-router-next";
import { isEmpty } from "lodash";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import {
  Icon,
  CellGroup,
  Cell,
  ActionSheet,
  RadioGroup,
  Radio,
  Tag,
  Stepper,
  Button,
} from "@antmjs/vantui";
import { ActionSheetItem } from "@antmjs/vantui/types/action-sheet";

import Container from "@/components/container";
import FileType from "@/components/file-type";
import {
  getFileName,
  getFileType,
  getPrintConfigMean,
  lookFile,
} from "@/utils";
import { FILE_CONFIG_MEANING, FILE_CONFIG_TYPES } from "@/constants/common";
import { useRouteData, useRouteParams } from "@/hooks";
import { ToFileConfigProps } from "@/pages/select-file";
import { EVENT_UPDATE_FILE } from "@/constants/events";
import { TEMP_DOCUMENT_STORAGE } from "@/constants/storage";

import styles from "./index.module.less";

interface Props {}

const FileConfig: React.FC<Props> = () => {
  const params = (useRouteParams() as unknown) as ToFileConfigProps;
  const { fileId, tempFilePath } = params;

  const editFileData = (useRouteData() || {}) as TempDocumentStorageType;
  const isEdit = !isEmpty(editFileData); // 是否为编辑状态进入
  const fileType = editFileData?.fileType || getFileType(fileId);
  const fileName = editFileData?.fileName || getFileName(fileId);
  const number = editFileData?.number || params.number;

  const selectData = useMemo(() => {
    const obj = {};
    for (const key in FILE_CONFIG_MEANING) {
      if (FILE_CONFIG_MEANING.hasOwnProperty(key)) {
        obj[key] = Object.keys(FILE_CONFIG_MEANING[key]).map((k) => ({
          key: k,
          name: FILE_CONFIG_MEANING[key][k],
        }));
      }
    }
    return obj;
  }, []);

  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const [currentSelect, setCurrentSelect] = useState("");
  const [actions, setActions] = useState<ActionSheetItem[]>([]);
  const [printConfig, setPrintConfig] = useState<DocumentConfigProps>(
    {} as DocumentConfigProps
  ); // 打印配置数据

  useEffect(() => {
    // 初始化数据
    if (isEdit) {
      setPrintConfig(editFileData);
    } else {
      setPrintConfig({
        [FILE_CONFIG_TYPES.TYPE]: "normal",
        [FILE_CONFIG_TYPES.SIZE]: "A4",
        [FILE_CONFIG_TYPES.COLOR]: "colourless",
        [FILE_CONFIG_TYPES.FACE]: "single",
        [FILE_CONFIG_TYPES.BIND]: "none",
        [FILE_CONFIG_TYPES.COUNT]: 1,
        [FILE_CONFIG_TYPES.NUMBER]: number,
      });
    }
  }, []);

  // 预览文件
  const handleLookFile = useCallback(async () => {
    lookFile({ fileId, filePath: tempFilePath });
  }, [fileId, tempFilePath]);

  // 打开底部弹框
  const handleOpenSheet = (curSelect) => {
    setIsOpenSheet(true);
    setCurrentSelect(curSelect);
    setActions(selectData[curSelect]);
  };

  // 关闭底部弹框
  const handleCloseSheet = () => {
    setIsOpenSheet(false);
  };

  // 编辑数据
  const handleEditPrintConfig = (key, value) => {
    setPrintConfig({ ...printConfig, [key]: value });
    setIsOpenSheet(false);
  };

  // 确认打印配置
  const handleConfirm = () => {
    let data: TempDocumentStorageType = {} as TempDocumentStorageType;
    if (isEdit && editFileData) {
      data = { ...editFileData, ...printConfig };
    } else {
      data = {
        ...printConfig,
        number,
        fileId,
        fileType,
        fileName,
        tempFilePath,
        id: new Date().getTime().toString(),
      };
    }
    // 写入本地缓存
    let documents = Taro.getStorageSync<TempDocumentStorageType[]>(
      TEMP_DOCUMENT_STORAGE
    );
    if (!documents) {
      documents = [];
    }
    if (isEdit) {
      documents = documents.map((item) => {
        if (item.id === editFileData.id) {
          return data;
        }
        return item;
      });
    } else {
      documents.unshift(data);
    }
    Taro.setStorageSync(TEMP_DOCUMENT_STORAGE, documents);
    Taro.eventCenter.trigger(EVENT_UPDATE_FILE);
    Router.back();
  };

  // 渲染单选
  const renderRadio = (key, value) => {
    const flag = printConfig[key] !== value;
    return (
      <Radio
        name={value}
        renderIcon={
          <Tag size="large" plain={flag} type={flag ? "default" : "primary"}>
            {getPrintConfigMean(value, key)}
          </Tag>
        }
      />
    );
  };

  return (
    <Container className={styles.wrapper}>
      <View className={styles.name}>
        <FileType type={fileType} />
        <Text>{fileName}</Text>
        <Text className={styles.size}>({number}页)</Text>
        <Icon name="eye-o" onClick={handleLookFile} />
      </View>

      <CellGroup className={styles.config}>
        <Cell
          title="纸张"
          value={getPrintConfigMean(
            printConfig[FILE_CONFIG_TYPES.TYPE],
            FILE_CONFIG_TYPES.TYPE
          )}
          isLink
          onClick={() => handleOpenSheet(FILE_CONFIG_TYPES.TYPE)}
        />
        <Cell
          title="尺寸"
          value={printConfig[FILE_CONFIG_TYPES.SIZE]}
          isLink
          onClick={() => handleOpenSheet(FILE_CONFIG_TYPES.SIZE)}
        />
        <Cell
          title="颜色"
          renderExtra={
            <RadioGroup
              direction="horizontal"
              onChange={(e) =>
                handleEditPrintConfig(FILE_CONFIG_TYPES.COLOR, e.detail)
              }
            >
              {renderRadio(FILE_CONFIG_TYPES.COLOR, "colourless")}
              {renderRadio(FILE_CONFIG_TYPES.COLOR, "colour")}
            </RadioGroup>
          }
        />
        <Cell
          title="单双面"
          renderExtra={
            <RadioGroup
              direction="horizontal"
              onChange={(e) =>
                handleEditPrintConfig(FILE_CONFIG_TYPES.FACE, e.detail)
              }
            >
              {renderRadio(FILE_CONFIG_TYPES.FACE, "single")}
              {renderRadio(FILE_CONFIG_TYPES.FACE, "double")}
            </RadioGroup>
          }
        />
        <Cell
          title="份数"
          renderExtra={
            <Stepper
              value={printConfig[FILE_CONFIG_TYPES.COUNT]}
              onChange={(e) =>
                handleEditPrintConfig(FILE_CONFIG_TYPES.COUNT, e.detail)
              }
            />
          }
        />
        <Cell
          title="装订方式"
          value={getPrintConfigMean(
            printConfig[FILE_CONFIG_TYPES.BIND],
            FILE_CONFIG_TYPES.BIND
          )}
          isLink
          onClick={() => handleOpenSheet(FILE_CONFIG_TYPES.BIND)}
        />
      </CellGroup>

      <Button
        block
        type="primary"
        className={styles.confirm}
        onClick={handleConfirm}
      >
        确定
      </Button>

      {/*弹出的选项*/}
      <ActionSheet
        show={isOpenSheet}
        actions={actions}
        onCancel={handleCloseSheet}
        onClose={handleCloseSheet}
        onSelect={(e) => handleEditPrintConfig(currentSelect, e.detail.key)}
      />
    </Container>
  );
};

export default FileConfig;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "文件设置",
  backgroundColor: "#f5f6f9",
});
