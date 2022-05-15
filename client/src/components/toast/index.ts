import Taro from "@tarojs/taro";

class Toast {
  defaultOption = {
    mask: true,
    duration: 2000,
  };

  loading(msg: string, options?: Taro.showLoading.Option) {
    return Taro.showLoading({ title: msg, ...this.defaultOption, ...options });
  }

  show(msg: string, options?: Taro.showToast.Option) {
    return new Promise((resolve) => {
      return Taro.showToast({
        title: msg,
        icon: "none",
        ...this.defaultOption,
        ...options,
      }).then(() => {
        setTimeout(() => {
          resolve(true);
        }, this.defaultOption.duration);
      });
    });
  }

  success(msg: string, options?: Taro.showToast.Option) {
    return new Promise((resolve) => {
      return Taro.showToast({
        title: msg,
        icon: "success",
        ...this.defaultOption,
        ...options,
      }).then(() => {
        setTimeout(() => {
          resolve(true);
        }, this.defaultOption.duration);
      });
    });
  }

  fail(msg: string, options?: Taro.showLoading.Option) {
    return new Promise((resolve) => {
      return Taro.showToast({
        title: msg,
        icon: "error",
        ...this.defaultOption,
        ...options,
      }).then(() => {
        setTimeout(() => {
          resolve(true);
        }, this.defaultOption.duration);
      });
    });
  }

  hideLoading() {
    Taro.hideLoading();
  }

  hideToast() {
    Taro.hideToast();
  }

  clear() {
    this.hideLoading();
    this.hideToast();
  }
}

export default new Toast();
