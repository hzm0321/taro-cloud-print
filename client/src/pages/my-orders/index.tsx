import React, { useEffect, useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import { Tabs, Tab } from "@antmjs/vantui";

import Container from "@/components/container";
import Toast from "@/components/toast";
import { ORDER_STATUS, ORDER_STATUS_MEANING } from "@/constants/common";
import { queryMyOrders } from "@/services";
import { useUserInfo } from "@/hooks";
import OrderCard from "@/components/order-card";
import Empty from "@/components/empty";
import { CloudOrderListData } from "@/types/function";
import { systemInfo } from "@/utils";

import styles from "./index.module.less";

interface Props {}

const MyOrders: React.FC<Props> = () => {
  const [orders, setOrders] = useState<CloudOrderListData[]>([]);
  const userInfo = useUserInfo();
  const [isOrderRefresh, setIsOrderRefresh] = useState(false); // 订单刷新状态

  useEffect(() => {
    init();
  }, []);

  function init() {
    Toast.loading("加载中...");
    if (userInfo?._id) {
      queryMyOrders({ userId: userInfo._id })
        .then((res) => {
          if (res.result.success) {
            setOrders(res.result.data);
          } else {
            Toast.fail(res.result.msg);
          }
        })
        .finally(() => {
          setIsOrderRefresh(false);
          Toast.hideLoading();
        });
    }
  }

  const onRefreshOrders = () => {
    setIsOrderRefresh(true);
    !isOrderRefresh && init();
  };

  const tabList = [
    ORDER_STATUS.WAIT,
    ORDER_STATUS.PRINTING,
    ORDER_STATUS.ING_DISPATCH,
    ORDER_STATUS.FINISHED,
  ].map((v) => ({
    title: ORDER_STATUS_MEANING[v],
    name: v,
    order: orders.filter((o) => o.status === v) || [],
  }));

  return (
    <Container padding={false} className={styles.wrapper}>
      <Tabs animated>
        {tabList.map(({ title, name, order }) => (
          <Tab title={title} key={name}>
            <ScrollView
              style={{
                height:
                  systemInfo.screenHeight -
                  (systemInfo.statusBarHeight || 0) -
                  45 -
                  50,
              }}
              scrollY
              scrollWithAnimation
              scrollAnchoring
              refresherEnabled
              refresherTriggered={isOrderRefresh}
              onRefresherRefresh={onRefreshOrders}
            >
              <View className={styles.content}>
                {order.length ? (
                  order.map((o) => <OrderCard value={o} key={o._id} />)
                ) : (
                  <Empty
                    type="file"
                    text="暂无订单"
                    style={{ marginTop: "50rpx" }}
                  />
                )}
              </View>
            </ScrollView>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default MyOrders;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "我的订单",
  backgroundColor: "#f5f6f9",
});
