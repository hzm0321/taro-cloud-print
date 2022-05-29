/********** users 表字段 **********/
declare interface UserDb extends CloudDatabase {
  _openid: string; // 用户唯一id
  avatarUrl: string; // 头像地址
  city: string; // 城市
  country: string; // 国家
  gender: number; // 性别
  language: string; // 语言
  nickName: string; // 昵称
  province: string; // 省份
}

/********** address 表字段 **********/
declare interface Area {
  code: string; // 地区编码
  name: string; // 名称
}

declare interface AddressDb extends CloudDatabase {
  addressDetail: string; // 详细地址
  area: Area[]; // 地区选项级联数据
  consignee: string; // 收货人
  phone: string; // 电话
  user_id: string; // 用户 id
}

/********** store 表字段 **********/
declare interface StoreDb extends CloudDatabase {
  address: string; // 地址
  description: string; // 介绍
  keywords: string[]; // 关键词
  name: string; // 名字
  officeHours: string; // 营业时间
  phone: string; // 电话
  position: { latitude: number; longitude: number }; // 地理位置
  rate: number; // 评分(满分 5)
  uuid: string; // 管理端绑定的管理员账号 id
  freightThreshold: number; // 运费阈值
  freight: number; // 运费
}

/********** prices 表字段 **********/
declare interface PriceDb extends CloudDatabase {
  store_id: string; // 店铺 id
  color: PrintConfig.COLOR;
  face: PrintConfig.FACE;
  type: PrintConfig.TYPE;
  size: string;
  price: number;
}

/********** order 表字段 **********/
declare interface OrderHistory {
  _updateTime: number;
  trackNo: string;
  status: number;
}

declare interface OrderDb extends CloudDatabase {
  address: AddressDb; // 地址信息
  body: string; // 支付备注
  files: TempDocumentStorageType[]; // 打印的文件信息
  openid: string; // 用户 openid
  orderType: ORDER_TYPES; // 订单类型
  outTradeNo: string; // 订单编号
  remark: string; // 订单备注
  status: number; // 订单状态
  store_id: string; // 店铺 id
  totalFee: number; // 订单价格
  user_id: string; // 用户 id
  histories: OrderHistory[]; // 订单历史
}
