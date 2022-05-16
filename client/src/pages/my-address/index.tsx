import React, { useCallback, useEffect, useState } from "react";
import Router from "tarojs-router-next";
import { View } from "@tarojs/components";
import { Button, Icon } from "@antmjs/vantui";

import AddressCard from "@/components/address-card";
import Empty from "@/components/empty";
import { useRouteParams, useUserInfo } from "@/hooks";
import { deleteMyAddress, queryMyAddress } from "@/services";
import Container from "@/components/container";
import Toast from "@/components/toast";
import Modal from "@/components/modal";

import { BackResult } from "../address-detail";
import styles from "./index.module.less";

interface Props {}

const MyAddress: React.FC<Props> = () => {
  const [addresses, setAddresses] = useState<AddressDb[]>([]);
  const userInfo = useUserInfo();
  const { readonly } = useRouteParams();

  console.log({ readonly });

  const _init = useCallback(() => {
    if (userInfo?._id) {
      Toast.loading("加载中...");
      queryMyAddress(userInfo._id)
        .then((res) => {
          if (res.result.success) {
            setAddresses(res.result.data);
          }
        })
        .finally(() => {
          Toast.hideLoading();
        });
    }
  }, [userInfo]);

  useEffect(() => {
    _init();
  }, [_init]);

  // 删除地址
  const handleDelete = useCallback(
    (addressId: string) => {
      Modal({
        title: "是否删除该地址?",
        onOk() {
          Toast.loading("删除中");
          deleteMyAddress(addressId)
            .then((r) => {
              if (r.result.success) {
                _init();
              }
            })
            .finally(() => {
              Toast.hideToast();
            });
        },
      }).catch((err) => {
        console.error(err);
      });
    },
    [_init]
  );

  const handleToAddressDetail = useCallback(
    async (address?: AddressDb) => {
      const backResult: BackResult =
        (await Router.toAddressDetail({ data: address })) || {};
      console.log("上一页返回的结果", backResult);
      if (backResult.success) {
        _init();
      }
    },
    [_init]
  );

  const handleAddressClick = useCallback((address) => {
    Router.back(address);
  }, []);

  return (
    <Container className={styles.wrapper}>
      {addresses.length > 0 ? (
        addresses.map((address) => (
          <View className={styles.item} key={address._id}>
            <AddressCard
              info={address}
              handleDelete={() => handleDelete(address._id)}
              handleEdit={() => handleToAddressDetail(address)}
              onClick={() => handleAddressClick(address)}
              isEdit={!readonly}
            />
          </View>
        ))
      ) : (
        <View className={styles.empty}>
          <Empty type="address" />
        </View>
      )}

      <View className={styles.add}>
        <Button
          type="primary"
          block
          round
          onClick={() => handleToAddressDetail()}
        >
          <Icon name="plus" style={{ marginRight: "10rpx" }} />
          添加收货地址
        </Button>
      </View>
    </Container>
  );
};

export default MyAddress;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "我的地址",
  backgroundColor: "#f5f6f9",
});
