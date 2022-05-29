// 订单状态
const ORDER_STATUS = {
  WAIT: 1, // 待打印
  WAIT_DISPATCH: 2, // 待配送
  ING_DISPATCH: 3, // 配送中
  WAIT_PICK: 4, // 待自提
  FINISHED: 5, // 已完成
  ING_REFUND: 6, // 退款中
  REJECT_REFUND: 7, // 退款驳回
  FINISHED_REFUND: 8 // 已退款
};

module.exports = { ORDER_STATUS };
