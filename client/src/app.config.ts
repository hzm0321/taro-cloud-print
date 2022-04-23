export default defineAppConfig({
  pages: ["pages/index/index", "pages/user/index"],
  window: {
    // backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    // navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    // custom: true,
    color: "#ddd",
    selectedColor: "#36b7ab",
    // borderStyle: "black",
    // backgroundColor: "#F5F6F8",
    list: [
      {
        pagePath: "pages/index/index",
        iconPath: "./assets/tabbar/print.png",
        selectedIconPath: "./assets/tabbar/print-hover.png",
        text: "首页",
      },
      {
        pagePath: "pages/user/index",
        iconPath: "./assets/tabbar/user.png",
        selectedIconPath: "./assets/tabbar/user-hover.png",
        text: "我的",
      },
    ],
  },
  cloud: true,
});
