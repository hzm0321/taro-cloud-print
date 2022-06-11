import React, { useCallback, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import { Button, Cell, CellGroup, Field, Notify, Dialog } from "@antmjs/vantui";
import Router from "tarojs-router-next";
import { trim } from "lodash";

import Toast from "@/components/toast";
import Container from "@/components/container";
import ImgStore from "@/assets/common/store.svg";
import ImgCoupon from "@/assets/common/coupon.svg";
import ImgAddress from "@/assets/common/address.svg";
import ImgRemark from "@/assets/common/remark.svg";
import ImgSuccess from "@/assets/common/success.svg";
import { useAppDispatch, useAppSelector, useRouteData } from "@/hooks";
import { formatArea, getTime, inversePrice } from "@/utils";
import { requestPay } from "@/services/pay";
import { EVENT_REFRESH_ORDERS } from "@/constants/events";
import {
  MESSAGE_TYPE,
  PAY_SUCCESS_ID,
  SHIPPING_REMINDER_ID,
} from "@/constants/message";
import { OrderTypes } from "@/constants/common";
import { addMessage, sendPaySuccessMessage } from "@/services/message";
import { clearFiles } from "@/slices/documentSlice";

import styles from "./index.module.less";

interface Props {}

const ConfirmOrder: React.FC<Props> = () => {
  const { storeData, files, totalPrice } = useRouteData() || {};
  const [selectedAddress, setSelectedAddress] = useState<AddressDb | null>(
    null
  ); // 当前选中的地址
  const [remark, setRemark] = useState("");
  const [isShowPaySuccessModal, setIsShowPaySuccessModal] = useState(false);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const paySuccessMsgRef = useRef<PaySuccessMessage>({} as PaySuccessMessage); // 支付成功的消息推送
  const payResRef = useRef({}); // 支付成功的返回数据

  const toSelectAddress = useCallback(async () => {
    const backResult = await Router.toMyAddress({ params: { readonly: true } });
    if (backResult) {
      setSelectedAddress(backResult);
    }
  }, []);

  // 发起微信支付
  const handleWxPay = () => {
    if (!storeData) {
      Notify.show({ type: "danger", message: "请选择打印店数据" });
      return;
    }
    if (!selectedAddress) {
      Notify.show({ type: "danger", message: "请选择收货地址" });
      return;
    }
    Toast.loading("支付中...");
    // 获取支付需要收集的信息
    if (user && storeData && files) {
      const data = {
        userId: user._id,
        storeId: storeData._id,
        files: files,
        orderType: OrderTypes.document,
        address: selectedAddress,
        remark,
      };
      // 发起支付
      requestPay(data)
        .then((res) => {
          if (res.result.success) {
            const { payment, outTradeNo, totalPrice } = res.result.data;
            payResRef.current = res.result.data;
            if (payment) {
              Taro.requestPayment({ ...payment })
                .then(() => {
                  // 支付成功
                  setIsShowPaySuccessModal(true);
                  // 保存消息推送的内容
                  paySuccessMsgRef.current = {
                    character_string1: { value: outTradeNo }, // 订单编号
                    thing5: { value: storeData.name }, // 店铺名称
                    amount10: { value: inversePrice(totalPrice) }, // 实付金额
                    time9: { value: getTime() }, // 付款日期
                    thing6: { value: trim(remark) || "无" }, // 备注
                  };
                })
                .catch((err) => {
                  // 支付取消
                  Toast.fail("支付取消");
                  console.error(err);
                });
            } else {
              Notify.show({ type: "danger", message: "支付失败" });
            }
          }
        })
        .finally(() => {
          Toast.hideLoading();
        });
    } else {
      Toast.fail("支付失败");
    }
  };

  // 支付成功的消息
  const handleMessage = () => {
    Taro.getSetting({ withSubscriptions: true })
      .then((setRes) => {
        // TODO 设置消息订阅
        Taro.requestSubscribeMessage({
          tmplIds: [PAY_SUCCESS_ID],
        })
          .then((msgRes) => {
            console.log("消息订阅", msgRes);
            // 支付成功订阅成功
            if (msgRes[PAY_SUCCESS_ID] === "accept") {
              sendPaySuccessMessage({
                msgType: MESSAGE_TYPE.PAY_SUCCESS,
                templateId: PAY_SUCCESS_ID,
                subMsg: paySuccessMsgRef.current,
                orderId: payResRef.current?.orderId,
              }).then((res) => {
                console.log("消息发送后的结果", res);
              });
            }
            // 收货通知订阅成功
            if (msgRes[SHIPPING_REMINDER_ID] === "accept") {
              addMessage({
                msgType: MESSAGE_TYPE.SHIPPING_REMINDER,
                templateId: SHIPPING_REMINDER_ID,
                status: 0, // 消息推送状态 0表示未推送 1表示已推送
                _createTime: new Date(),
              });
            }
          })
          .finally(() => {
            // 清空本地数据
            dispatch(clearFiles());

            // Router.back({ isPaySuccess: true });
            setTimeout(() => {
              Taro.switchTab({
                url: "/pages/index/index",
              }).then((res) => {
                Taro.eventCenter.trigger(EVENT_REFRESH_ORDERS);
              });
            }, 1000);
          });
      })
      .catch(() => {
        Taro.showToast({
          title: "请更新您微信版本，来获取订阅消息功能",
          icon: "none",
        });
      });
  };

  return (
    <Container className={styles.wrapper}>
      <View className={styles.title}>订单支付</View>
      <CellGroup inset>
        <Cell
          title="打印店"
          value={storeData?.name}
          renderIcon={<Image src={ImgStore} className={styles.icon} />}
        />
        <Cell
          title="优惠券"
          value="无"
          isLink
          renderIcon={<Image src={ImgCoupon} className={styles.icon} />}
        />
        {selectedAddress ? (
          <Cell
            title={`${selectedAddress.consignee} ${selectedAddress.phone}`}
            label={`${formatArea(selectedAddress.area)} ${
              selectedAddress.addressDetail
            }`}
            isLink
            renderIcon={<Image src={ImgAddress} className={styles.icon} />}
            onClick={toSelectAddress}
          />
        ) : (
          <Cell
            title="添加地址"
            isLink
            renderIcon={<Image src={ImgAddress} className={styles.icon} />}
            onClick={toSelectAddress}
          />
        )}
        <Cell
          title="备注"
          renderIcon={<Image src={ImgRemark} className={styles.icon} />}
        />
        <View className={styles.textarea}>
          <Field
            value={remark}
            onChange={(e) => setRemark(e.detail)}
            type="textarea"
            placeholder="请输入订单备注信息"
            autosize
            border
            maxlength={100}
          />
        </View>
      </CellGroup>
      <View className={styles.amount}>
        <View className={styles.label}>实际应付</View>
        <View className={styles.price}>¥ {inversePrice(totalPrice)}</View>
      </View>
      <Button type="primary" block round onClick={handleWxPay}>
        微信支付
      </Button>
      <Notify id="vanNotify" />
      <Dialog
        title="支付成功"
        show={isShowPaySuccessModal}
        showCancelButton={false}
        onClose={handleMessage}
        confirmButtonColor="#36b7ab"
      >
        <View style={{ textAlign: "center" }}>
          <Image src={ImgSuccess} style={{ height: 80, paddingBottom: 20 }} />
        </View>
      </Dialog>
    </Container>
  );
};

export default ConfirmOrder;

definePageConfig({
  backgroundTextStyle: "light",
  navigationBarBackgroundColor: "#36b7ab",
  navigationBarTextStyle: "white",
  navigationBarTitleText: "订单支付",
  backgroundColor: "#f5f6f9",
});
