<div align="center">
<h1>taro-cloud-print</h1>
   <a href="https://github.com/hzm0321/taro-cloud-print">
      <img src="https://img.shields.io/github/forks/hzm0321/taro-cloud-print" alt="npm downloads" />
   </a>
   <a href="https://github.com/hzm0321/taro-cloud-print">
      <img src="https://img.shields.io/github/watchers/hzm0321/taro-cloud-print" alt="npm downloads" />
   </a>
   <a href="https://github.com/hzm0321/taro-cloud-print">
      <img src="https://img.shields.io/github/license/hzm0321/taro-cloud-print" alt="npm downloads" />
   </a>
   <a href="https://github.com/hzm0321/taro-cloud-print">
      <img src="https://img.shields.io/github/stars/hzm0321/taro-cloud-print?style=social" alt="npm downloads" />
   </a>
</div>

## 介绍

本项目主要基于最新的 Taro V3 框架并结合微信云开发全栈开发一款微信云打印小程序。支持pdf文件页数解析、打印文件云存储、微信支付、消息订阅等功能。目前已经开源了`微信小程序端`和`云开发端`的代码。

## 技术栈

本项目使用的技术栈为：

- [Taro](https://nervjs.github.io/taro/)
- [Weapp](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [WeCloudbase](https://cloud.weixin.qq.com/cloudbase)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux](https://redux.js.org/)
- [@antmjs/vantui](https://antmjs.github.io/vantui/#/home)

## 小程序效果预览

### 扫码体验
![avatar](https://raw.githubusercontent.com/hzm0321/picgo/master/img/20220608195005.png)

### 效果图
<img src="https://raw.githubusercontent.com/hzm0321/picgo/master/img/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A120220415-123004%402x.png" width = "280" height = "auto" />
<img src="https://raw.githubusercontent.com/hzm0321/picgo/master/img/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A120220415-123115%402x.png" width = "280" height = "auto" />
<img src="https://raw.githubusercontent.com/hzm0321/picgo/master/img/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A120220415-123131%402x.png" width = "280" height = "auto" />
<img src="https://raw.githubusercontent.com/hzm0321/picgo/master/img/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A120220415-123155%402x.png" width = "280" height = "auto" />

## 开始使用

### 申请小程序 appid

把项目根目录下的 `project.config.json` 文件中的 `appid` 替换为自己申请的小程序 `appid`。

### 开通云开发环境

可在微信开发者工具创建项目时开通微信云开发服务, 开通成功后会自动生成一个`环境ID`。
把申请到的`环境ID`替换项目 `client/config/env.js` 中的 `CLOUD_SERVICE` 变量。

```javascript
export const CLOUD_SERVICE = "XXXXXX"; // 你的环境ID
```

### 创建云数据库集合

本项目目前使用云数据库集合及字段内容如下:

* **store 集合**：打印店商家数据

| 字段名              | 说明       | 类型           | 备注                       |
|------------------|----------|--------------|--------------------------|
| _id              | 唯一 id    | `string`     | -                        |
| address          | 商家地址     | `string`     | -                        |
| description      | 打印店简介    | `string`     | -                        |
| freight          | 配送费      | `number`     | -                        |
| freightThreshold | 配送费触发阈值  | `number`     | -                        |
| keywords         | 打印店关键词   | `string[]`   | -                        |
| name             | 打印店名字    | `string`     | -                        |
| officeHours      | 打印店营业时间  | `string`     | -                        |
| phone            | 打印店电话    | `string`     | -                        |
| position         | 打印店经纬度位置 | `Position`   | 该格式具有特殊性，数据库导入和前端读取格式不一样 |
| rate             | 评分       | `number`     | -                        |
| bindPrices       | 装订价格     | `BindPrices` | -                        |

**BindPrices**

| 字段名           | 说明      | 类型       | 备注  |
|---------------|---------|----------|-----|
| none          | 不装订     | `number` | -   |
| staple        | 订书针装订   | `number` | -   |
| concave       | 凹纹封面无标题 | `number` | -   |
| concave_title | 凹纹封面有标题 | `number` | -   |
| old           | 复古封面无标题 | `number` | -   |

* **address 集合**：收货地址数据

| 字段名           | 说明     | 类型                               | 备注  |
|---------------|--------|----------------------------------|-----|
| _id           | 唯一 id  | `string`                         | -   |
| _createTime   | 记录创建时间 | `number`                         | -   |
| _updateTime   | 记录更新时间 | `number`                         | -   |
| addressDetail | 具体地址   | `string`                         | -   |
| area          | 地区     | `{code: string, name: string}[]` | -   |
| consignee     | 收货人    | `string`                         | -   |
| phone         | 电话     | `string`                         | -   |
| user_id       | 用户 id  | `string`                         | -   |

* **orders 集合**：订单数据

| 字段名         | 说明             | 类型          | 备注  |
|-------------|----------------|-------------|-----|
| _id         | 唯一 id          | `string`    | -   |
| _createTime | 记录创建时间         | `number`    | -   |
| _updateTime | 记录更新时间         | `number`    | -   |
| body        | 打印订单           | `string`    | -   |
| openid      | 微信用户对应小程序唯一 id | `string`    | -   |
| orderType   | 订单类型           | `string`    | -   |
| outTradeNo  | 订单编号           | `string`    | -   |
| remake      | 备注             | `string`    | -   |
| status      | 订单状态           | `number`    | -   |
| store_id    | 对应的打印店家 id     | `number`    | -   |
| totalFee    | 订单实付价格         | `number`    | -   |
| user_id     | 用户 id          | `string`    | -   |
| address     | 收货地址数据         | `Address`   | -   |
| files       | 打印文件           | `File[]`    | -   |
| histories   | 订单状态变更表历史记录    | `History[]` | -   |

**File**

| 字段名          | 说明         | 类型       | 备注  |
|--------------|------------|----------|-----|
| id           | 唯一 id      | `string` | -   |
| bind         | 装订方式       | `string` | -   |
| color        | 颜色         | `string` | -   |
| count        | 份数         | `number` | -   |
| face         | 单双面        | `string` | -   |
| fileId       | 文件云存储 id   | `string` | -   |
| fileName     | 文件名        | `string` | -   |
| fileType     | 文件类型       | `string` | -   |
| number       | 文件页数       | `number` | -   |
| price        | 打印价格       | `number` | -   |
| size         | 打印尺寸       | `string` | -   |
| tempFilePath | 用户本地临时存储地址 | `string` | -   |
| type         | 纸张         | `string` | -   |

**History**

| 字段名         | 说明     | 类型       | 备注  |
|-------------|--------|----------|-----|
| _updateTime | 记录更新时间 | `number` | -   |
| status      | 状态     | `number` | -   |
| trackNo     | 快递单号   | `string` | -   |

* **swiper 集合**：轮播图数据

| 字段名      | 说明           | 类型     | 备注 |
| ------------- | ---------------- | ---------- | ------ |
| _id         | 唯一 id        | `string` | -    |
| _createTime | 记录创建时间   | `number` | -    |
| _updateTime | 记录更新时间   | `number` | -    |
| imgSrc      | 图片云储存地址 | `string` | -    |

* **prices 集合**：打印价格数据

| 字段名         | 说明             | 类型       | 备注  |
|-------------|----------------|----------|-----|
| _id         | 唯一 id          | `string` | -   |
| _createTime | 记录创建时间         | `number` | -   |
| _updateTime | 记录更新时间         | `number` | -   |
| _openid     | 微信用户对应小程序唯一 id | `string` | -   |
| color       | 颜色             | `string` | -   |
| face        | 单双面            | `string` | -   |
| price       | 打印价格           | `number` | -   |
| size        | 打印尺寸           | `string` | -   |
| type        | 纸张             | `string` | -   |
| store_id    | 对应的打印店 id      | `string` | -   |

* **users 集合**：用户数据

| 字段名       | 说明             | 类型       | 备注  |
|-----------|----------------|----------|-----|
| _id       | 唯一 id          | `string` | -   |
| _openid   | 微信用户对应小程序唯一 id | `string` | -   |
| avatarUrl | 用户头像地址链接       | `string` | -   |
| city      | 所在城市           | `string` | -   |
| country   | 所在国家           | `string` | -   |
| gender    | 性别             | `number` | -   |
| language  | 语言             | `string` | -   |
| nickName  | 微信昵称           | `string` | -   |
| province  | 所在省份           | `string` | -   |

在项目的 `client/mock` 文件夹中准备了各个集合的 mock 数据，可按需导入。

### 安装依赖

进入项目 `client` 目录，使用 `yarn` 直接安装依赖。

```bash
$ yarn install
```

开发模式启动

```bash
$ yarn dev:weapp
```

生产环境打包

```bash
$ yarn build:weapp
```

## 项目目录结构

```
.
├── LICENSE
├── README.md
├── client
│   ├── babel.config.js             # babel配置文件
│   ├── config                      # taro 打包配置文件
│   ├── dist                        # taro 打包制品
│   ├── global.d.ts                 # 全局类型定义文件
│   ├── mock                        # 数据库 mock 数据
│   ├── package.json                # 项目依赖配置文件
│   ├── src                     
│   │   ├── app.config.ts           # 小程序配置文件
│   │   ├── app.less                # 小程序全局样式文件
│   │   ├── app.tsx                 # 小程序入口文件
│   │   ├── assets                  # 小程序静态资源
│   │   ├── components              # 小程序组件
│   │   ├── constants               # 常量
│   │   ├── hooks                   # 自定义 hooks
│   │   ├── index.html              # 小程序入口挂载页面
│   │   ├── pages
│   │   │   ├── about-we            # "关于我们"页面
│   │   │   ├── address-detail      # "编辑地址"页面
│   │   │   ├── confirm-order       # "确认订单"页面
│   │   │   ├── file-config         # "文件配置"页面
│   │   │   ├── index               # "首页"页面
│   │   │   ├── my-address          # "我的地址"页面
│   │   │   ├── my-orders           # "我的订单"页面
│   │   │   ├── order-detail        # "订单详情"页面
│   │   │   ├── price-list          # "价格列表"页面
│   │   │   ├── print-options       # "打印选项"页面
│   │   │   ├── select-file         # "选择文件"页面
│   │   │   ├── store-detail        # "打印店详情"页面
│   │   │   └── user-info           # "用户"页面
│   │   ├── services                # 接口服务
│   │   ├── slices                  # redux slices
│   │   ├── store                   # redux store
│   │   ├── styles                  # 小程序全局样式变量
│   │   ├── types                   # 类型声明
│   │   └── utils                   # 工具函数
│   ├── tsconfig.json               # tsc 配置文件
│   └── yarn.lock                   # 项目依赖 yarn 锁定文件
├── cloud                           # 云函数
│   └── functions
│       ├── file                    # 文件解析云函数
│       ├── login                   # 登录云函数
│       ├── order                   # 订单相关云函数
│       ├── pay                     # 支付云函数
│       ├── paySuccess              # 支付成功云函数
│       ├── sendMessage             # 发送模板消息云函数
│       ├── store                   # 打印店相关云函数
│       ├── userInfo                # 用户相关云函数
│       ├── wx-ext-cms-api          # wx-ext-cms-XXX 的都是腾讯云 cms 生成的云函数
│       ├── wx-ext-cms-fx-openapi
│       ├── wx-ext-cms-init
│       ├── wx-ext-cms-openapi
│       ├── wx-ext-cms-service
│       └── wx-ext-cms-sms
├── project.config.json             # 项目配置文件
├── project.private.config.json     # 项目私有配置文件
```

## 微信生态

### 微信支付

本项目整合了微信支付功能，这也是微信云开发免鉴权带来的优势，极大地降低了微信支付后端开发门槛。
微信支付目前需要将公众号升级为服务号才可使用，暂不支持个人开发者使用。如果申请到了微信商家号，可先将商家号添加到云开发环境中，在项目 `cloud/functions/pay/constants/common.js` 文件中 `MCH_Id` 修改为自己的商家号。

### 消息订阅

本项目目前开发了在用户支付成功时，向用户发送支付成功的消息。需要进入微信小程序后台，进入`订阅消息` 模块，选用`公共模板库`→`一次性消息订阅`→`订单支付成功提醒`，选择自己需要的模板行内容。
本项目依次选用了5个选项：

1. 订单编号
2. 店铺名称
3. 付款金额
4. 付款日期
5. 备注

进入项目 `client/src/constants/message.ts` 文件中 修改 `PAY_SUCCESS_ID` 变量，替换为自己的模板ID。

## 开发注意事项

### 金额数据存储

因为打印订单的金额计算最小到分，所以项目上所有存储在后端的金额数据扩大 100 倍，以整数的形式进行存储并参与计算。在 `client/src/utils/global.ts` 文件中提供 `formatPrice` 和 `inversePrice` 两个方法用于价格数据转换。

### 开发模式下直接真机预览

在开发模式下 Taro 编译出来的包一般会大于 2m，因此在最新版的微信小程序开发者工具下的`本地设置`选项下建议开启`预览及真机调试时主包、分包体积上限调整为4M`。

## FAQ

### View 等标签元素出现类型报错

如果出现 `'XXX' cannot be used as a JSX component.` 这类的报错是因为 `react-redux` 所依赖的 `hoist-non-react-statics` 的类型定义与 Taro 冲突造成的，去 `node_modules/types` 下把 `hoist-non-react-statics` 删除就好了
