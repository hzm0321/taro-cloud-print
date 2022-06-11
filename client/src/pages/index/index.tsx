import { useEffect, useMemo, useState } from "react";
import { Router } from "tarojs-router-next";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  Grid,
  GridItem,
  Tab,
  Tabs,
} from "@antmjs/vantui";
import Taro, { usePullDownRefresh, useTabItemTap } from "@tarojs/taro";

import ImgCopy from "@/assets/home/copy.svg";
import ImgDocument from "@/assets/home/document.svg";
import ImgImage from "@/assets/home/image.svg";
import ImgTest from "@/assets/home/test.svg";
import { queryMyOrders } from "@/services/order";
import { querySwiper } from "@/services/swiper";
import { GridItemKeys } from "@/constants/global";
import { useAppDispatch, useAppSelector } from "@/hooks";
import Container from "@/components/container";
import Toast from "@/components/toast";
import Login from "@/components/login";
import Empty from "@/components/empty";
import { ORDER_STATUS_MEANING } from "@/constants/common";
import OrderCard from "@/components/order-card";
import { login } from "@/slices/userSlice";

import styles from "./index.module.less";

interface SwiperType extends CloudDatabase {
  imgSrc: string;
}

enum MenuItems {
  all = "all",
  document = "document",
}

const Index = () => {
  const [swiperList, setSwiperList] = useState<SwiperType[]>([]);
  const [orders, setOrders] = useState<CloudOrderListData[]>([]);
  const [currentMenuItem, setCurrentMenuItem] = useState(MenuItems.all);

  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const isLogin = !!user._id;

  usePullDownRefresh(() => {
    _initOrders();
    Taro.stopPullDownRefresh();
  });

  useEffect(() => {
    querySwiper()
      .then((res) => {
        setSwiperList(res.data as SwiperType[]);
      })
      .catch(() => {
        Toast.fail("轮播图加载失败");
      });
  }, []);

  useEffect(() => {
    _initOrders();
  }, [user?._id, currentMenuItem]);

  // 切换底部菜单时刷新订单数据
  useTabItemTap(() => {
    if (user?._id) {
      _initOrders();
    }
  });

  // 请求订单数据
  const _initOrders = () => {
    const userId = user._id;
    return new Promise((resolve, reject) => {
      if (userId) {
        Toast.loading("加载中...");
        return queryMyOrders({
          userId: userId,
          orderType: currentMenuItem,
          isUnfinished: true,
        })
          .then((res) => {
            if (res.result.success) {
              setOrders(res.result.data);
              resolve(res.result.data);
            } else {
              Toast.fail(res.result.msg);
              reject(res.result.msg);
            }
          })
          .finally(() => {
            Toast.hideLoading();
          });
      } else {
        reject("请先登录");
      }
    });
  };

  // 功能入口列表
  const gridItemList = useMemo(() => {
    const handleItemClick = async (key: GridItemKeys) => {
      // 进入入口前校验一遍登录状态
      if (!isLogin) {
        dispatch(login());
      } else {
        switch (key) {
          case GridItemKeys.document:
            Router.toPrintOption();
            break;
          default:
            Toast.show("此功能暂未开放, 敬请期待");
            break;
        }
      }
    };
    const items = [
      {
        key: GridItemKeys.document,
        icon: ImgDocument,
        text: "文档打印",
      },
      {
        key: GridItemKeys.copy,
        icon: ImgCopy,
        text: "复印",
      },
      {
        key: GridItemKeys.photo,
        icon: ImgImage,
        text: "照片打印",
      },
      {
        key: GridItemKeys.text,
        icon: ImgTest,
        text: "实验室",
      },
    ];
    return items.map((item) => ({
      ...item,
      onClick: () => handleItemClick(item.key),
    }));
  }, [isLogin]);

  // 下拉列表选项
  const menuOptions = useMemo(() => {
    return [
      {
        text: "全部打印",
        value: MenuItems.all,
      },
      {
        text: "文档打印",
        value: MenuItems.document,
      },
    ];
  }, []);

  // 订单 tabs
  const orderTabs = useMemo(() => {
    let orderList: any[] = [];
    orders.forEach((order) => {
      if (!orderList[order.status]) {
        orderList[order.status] = [];
      }
      orderList[order.status].push(order);
    });

    orderList = orderList.filter(Boolean).map((item) => {
      return {
        title: ORDER_STATUS_MEANING[item[0].status],
        count: item.length,
        order: item,
      };
    });
    return orderList;
  }, [orders]);

  return (
    <Container padding={false} className={styles.wrapper}>
      <View className={styles.header}>
        <Swiper
          className={styles.swiper}
          indicatorColor="#999"
          indicatorActiveColor="#36b7ab"
          circular
          indicatorDots
          autoplay
        >
          {swiperList.map(({ _id, imgSrc }) => (
            <SwiperItem key={_id}>
              <View className={styles["swiper-item"]}>
                <Image src={imgSrc} className={styles["swiper-img"]} />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        <Grid border={false}>
          {gridItemList.map(({ key, ...item }) => (
            <GridItem key={key} {...item} />
          ))}
        </Grid>
      </View>
      <View className={styles.content}>
        {isLogin ? (
          <View className={styles.orders}>
            <DropdownMenu activeColor="#36b7ab" className={styles.menu}>
              <DropdownItem
                value={currentMenuItem}
                options={menuOptions}
                onChange={(e) => {
                  setCurrentMenuItem(e as MenuItems);
                }}
              />
            </DropdownMenu>
            {orders.length ? (
              <Tabs
                sticky
                type="line"
                animated
                titleActiveColor="#36b7ab"
                className={styles.tabs}
              >
                {orderTabs.map((tab) => (
                  <Tab
                    key={tab.title}
                    title={`${tab.title} ${tab.count}`}
                    className={styles.tab}
                  >
                    {tab.order.map((o) => (
                      <OrderCard value={o} key={o._id} />
                    ))}
                  </Tab>
                ))}
              </Tabs>
            ) : (
              <Empty
                type="file"
                text="暂无未完成订单"
                style={{ marginTop: "50rpx" }}
                extra={
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => Router.toPrintOption()}
                  >
                    立即打印
                  </Button>
                }
              />
            )}
          </View>
        ) : (
          <Empty
            type="login"
            style={{ marginTop: "50rpx" }}
            extra={<Login afterLogin={_initOrders} />}
          />
        )}
      </View>
    </Container>
  );
};

export default Index;

definePageConfig({
  navigationBarTitleText: "活字印刷云打印",
  enablePullDownRefresh: true,
});
