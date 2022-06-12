import React, { useEffect, useMemo, useState } from "react";
import { Image, View } from "@tarojs/components";
import { Button, Cell, CellGroup, Icon, Steps } from "@antmjs/vantui";
import Router, { NavigateType } from "tarojs-router-next";

import Container from "@/components/container";
import Toast from "@/components/toast";
import StoreCard from "@/components/store-card";
import FileType from "@/components/file-type";
import Modal from "@/components/modal";
import { useRouteParams } from "@/hooks";
import { ORDER_STATUS, ORDER_STATUS_MEANING } from "@/constants/common";
import { confirmPrintOrder, queryOrderByOutTradeNo } from "@/services/order";
import { queryStoreById } from "@/services/store";
import {
  dateFormat,
  formatArea,
  getFileMean,
  handleCopy,
  inversePrice,
} from "@/utils";
import ImgCoupon from "@/assets/common/coupon.svg";
import ImgAddress from "@/assets/common/address.svg";
import ImgRemark from "@/assets/common/remark.svg";
import ImgPrice from "@/assets/common/price.svg";

import styles from "./index.module.less";

interface Props {}

const OrderDetail: React.FC<Props> = () => {
  const { outTradeNo } = useRouteParams();
  const [orderDetail, setOrderDetail] = useState<OrderDb>({} as OrderDb);
  const [storeData, setStoreData] = useState<StoreDb>({} as StoreDb);

  useEffect(() => {
    if (outTradeNo) {
      Toast.loading("加载中...");
      queryOrderByOutTradeNo({ outTradeNo })
        .then((res) => {
          if (res.result.success) {
            setOrderDetail(res.result.data);
            queryStoreById(res.result.data.store_id).then((storeRes) => {
              if (storeRes.result.success) {
                setStoreData(storeRes.result.data);
              }
            });
          }
        })
        .finally(() => {
          Toast.hideLoading();
        });
    }
  }, [outTradeNo]);

  const steps = useMemo(() => {
    if (orderDetail.histories) {
      return orderDetail.histories
        .map((item) => ({
          text: (
            <View
              className={styles.status}
              style={{
                color:
                  item.status === ORDER_STATUS.FINISHED ? "#36b7ab" : "black",
              }}
            >
              {ORDER_STATUS_MEANING[item.status]}
            </View>
          ),
          desc: (
            <View className={styles.desc}>
              {item.status === ORDER_STATUS.ING_DISPATCH && (
                <View>
                  快递单号: {item.trackNo}{" "}
                  <Icon
                    name="orders-o"
                    color="#36b7ab"
                    onClick={() =>
                      handleCopy(item.trackNo, "已复制快递单号到剪贴板")
                    }
                  />{" "}
                  (复制后在公众号首页查询)
                </View>
              )}
              <View>
                {dateFormat("YYYY-mm-dd HH:MM", new Date(item._updateTime))}
              </View>
            </View>
          ),
          inactiveIcon: "clock-o",
          activeIcon: "checked",
        }))
        .reverse();
    }
    return [];
  }, [orderDetail.histories]);

  // 确定收货
  const handleConfirmGoods = () => {
    Modal({
      title: "确认收货",
      content:
        " 请确认您收到的文件没有缺页、漏页、装订、印刷错误等问题后, 再确认收货",
      onOk() {
        Toast.loading("确认中...");
        confirmPrintOrder({ orderId: orderDetail._id })
          .then((res) => {
            if (res.result.success) {
              Toast.success("确认成功").then(() => {
                Router.toMyOrders({
                  type: NavigateType.redirectTo,
                  params: { tabsStatus: ORDER_STATUS.FINISHED },
                });
              });
            } else {
              Toast.fail("确认失败");
            }
          })
          .catch((err) => {
            Toast.fail(err);
          })
          .finally(() => {
            Toast.hideLoading();
          });
      },
    });
  };

  return (
    <Container className={styles.wrapper}>
      <View className={styles.header}>
        <View className={styles.status}>
          {ORDER_STATUS_MEANING[orderDetail.status]}
        </View>
        <View className={styles.no}>订单编号：{outTradeNo}</View>
      </View>
      {/*打印商家*/}
      <View className={styles.card} style={{ padding: "0" }}>
        <View className={styles.title} style={{ padding: "15px 0 0 15px" }}>
          打印商家
        </View>
        <StoreCard value={storeData} readonly />
      </View>
      {/*打印进度*/}
      <View className={styles.card}>
        <View className={styles.title}>打印进度</View>
        <Steps
          steps={steps}
          active={orderDetail.status === ORDER_STATUS.FINISHED ? 0 : -1}
          direction="vertical"
          activeColor="#36b7ab"
          className={styles.steps}
        />
      </View>
      {/*打印文件*/}
      <View className={styles.card}>
        <View className={styles.title}>打印文件</View>
        {orderDetail.files?.map((file) => (
          <Cell
            key={file.fileId}
            border={false}
            renderIcon={
              <FileType type={file.fileType} className={styles["file-icon"]} />
            }
            renderTitle={
              <View>
                <View className={styles.name}>{file.fileName}</View>
                <View className={styles.detail}>{getFileMean(file)}</View>
              </View>
            }
            renderExtra={
              <View className={styles.price}>¥ {inversePrice(file.price)}</View>
            }
            className={styles.file}
          />
        ))}
      </View>
      {/*其他信息*/}
      <View className={styles.card}>
        <CellGroup className={styles.other} border={false}>
          <Cell
            title="优惠券"
            value="无"
            renderIcon={<Image src={ImgCoupon} className={styles.icon} />}
            className={styles.cell}
          />
          <Cell
            title="收货地址"
            renderExtra={
              <View className={styles.address}>
                <View className={styles.name}>
                  {orderDetail.address?.consignee} {orderDetail.address?.phone}
                </View>
                <View className={styles.detail}>
                  {formatArea(orderDetail.address?.area)}{" "}
                  {orderDetail.address?.addressDetail}
                </View>
              </View>
            }
            renderIcon={<Image src={ImgAddress} className={styles.icon} />}
            className={styles.cell}
          />
          <Cell
            title="备注"
            value={orderDetail.remark}
            renderIcon={<Image src={ImgRemark} className={styles.icon} />}
            className={styles.cell}
          />
          <Cell
            title="实付价格"
            renderExtra={
              <View className={styles.price}>
                ¥ {inversePrice(orderDetail.totalFee)}
              </View>
            }
            renderIcon={<Image src={ImgPrice} className={styles.icon} />}
            className={styles.cell}
            border={false}
          />
        </CellGroup>
      </View>
      {/*底部操作栏*/}
      {orderDetail.status === ORDER_STATUS.ING_DISPATCH && (
        <>
          <View className={styles.operation}>
            <Button type="primary" block onClick={handleConfirmGoods}>
              确认收货
            </Button>
          </View>
          <View className={styles.placeholder} />
        </>
      )}
    </Container>
  );
};

export default OrderDetail;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "订单详情",
  backgroundColor: "#f5f6f9",
});
