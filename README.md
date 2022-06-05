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

## 开始使用

### 申请小程序 appid

把项目根目录下的 `project.config.json` 文件中的 `appid` 替换为自己申请的小程序 `appid`。

### 开通云开发环境

可在微信开发者工具创建项目时开通微信云开发服务, 开通成功后会自动生成一个`环境ID`。
把申请到的`环境ID`替换项目 `client/config/env.js` 中的 `CLOUD_SERVICE` 变量。

```javascript
export const CLOUD_SERVICE = "XXXXXX"; // 你的环境ID
```

在项目的支付云函数(`could/functions/pay`)中也会使用的环境ID，如果项目开通了微信支付权限，也需要替换支付云函数中的环境 ID。

### 创建云数据库集合

本项目目前使用云数据库集合及字段内容如下:

* **store 集合**：打印店商家数据
* **orders 集合**：订单数据
* **address 集合**：收货地址数据
* **swiper 集合**：轮播图数据
* **prices 集合**：打印价格数据
* **users 集合**：用户数据

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





