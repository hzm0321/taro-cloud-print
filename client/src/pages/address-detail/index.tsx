import React, { useCallback, useRef } from "react";
import Router from "tarojs-router-next";
import { Button, CellGroup, Form, FormItem, Icon } from "@antmjs/vantui";
import { IFormInstanceAPI } from "@antmjs/vantui/types/form";
import { Input, View, Textarea } from "@tarojs/components";

import { useRouteData, useUserInfo } from "@/hooks";
import { addAddress, updateAddress } from "@/services";
import Container from "@/components/container";
import Toast from "@/components/toast";

import AreaSelect from "./components/area-select";
import styles from "./index.module.less";

interface Props {}

export interface BackResult {
  success: boolean;
}

const AddressDetail: React.FC<Props> = () => {
  const formRef = useRef<IFormInstanceAPI>();
  const userInfo = useUserInfo();
  const address = useRouteData<AddressDb>();

  const handleSubmit = useCallback(() => {
    formRef.current?.validateFields((err, values) => {
      if (err.length === 0) {
        if (userInfo?._id) {
          Toast.loading("保存中");
          const updateApi = address ? updateAddress : addAddress;
          updateApi({
            ...address,
            ...values,
            user_id: userInfo?._id,
          } as AddressDb).then((res) => {
            if (res.result.success) {
              Toast.success("保存成功").then(() => {
                Router.back({ success: true } as BackResult);
              });
            } else {
              Toast.fail(res.result.msg);
            }
          });
        }
      }
    });
  }, [userInfo?._id, address]);

  return (
    <Container padding={false} className={styles.wrapper}>
      <CellGroup inset title="收货信息">
        <Form ref={formRef} initialValues={address}>
          <FormItem
            label="收货人"
            name="consignee"
            required
            trigger="onInput"
            validateTrigger="onBlur"
            // taro的input的onInput事件返回对应表单的最终值为e.detail.value
            valueFormat={(e) => e.detail.value}
          >
            <Input placeholder="请输入收货人名称" />
          </FormItem>
          <FormItem
            label="手机号码"
            name="phone"
            required
            rules={{
              rule: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: "请输入正确的11位手机号",
            }}
            trigger="onInput"
            validateTrigger="onBlur"
            valueFormat={(e) => e.detail.value}
          >
            <Input placeholder="请输入手机号码" type="number" maxlength={11} />
          </FormItem>
          <FormItem
            label="所在地区"
            name="area"
            required
            valueFormat={(e) => e.detail.value}
            valueKey="value"
            trigger="onConfirm"
            renderRight={<Icon name="arrow" />}
          >
            <AreaSelect />
          </FormItem>
          <FormItem
            label="详细地址"
            name="addressDetail"
            required
            trigger="onInput"
            validateTrigger="onBlur"
            valueFormat={(e) => e.detail.value}
          >
            <Textarea placeholder="请输入详细地址" maxlength={40} autoHeight />
          </FormItem>
        </Form>
      </CellGroup>
      <View className={styles.save}>
        <Button type="primary" block round onClick={handleSubmit}>
          保存
        </Button>
      </View>
    </Container>
  );
};

export default AddressDetail;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "编辑地址",
  backgroundColor: "#f5f6f9",
});
