import Taro from "@tarojs/taro";

class Toast {
  defaultOption = {
    mask: true,
    duration: 2000,
  };

  private generateToast(
    msg: string,
    icon: "success" | "error" | "loading" | "none",
    options?: Partial<Taro.showToast.Option>
  ) {
    return new Promise((resolve) => {
      return Taro.showToast({
        title: msg,
        icon,
        ...this.defaultOption,
        ...options,
      }).then(() => {
        setTimeout(() => {
          resolve(true);
        }, this.defaultOption.duration);
      });
    });
  }

  loading(msg: string, options?: Partial<Taro.showLoading.Option>) {
    const { duration, ...otherDefaultOptions } = this.defaultOption;
    return Taro.showLoading({ title: msg, ...otherDefaultOptions, ...options });
  }

  show(msg: string, options?: Partial<Taro.showToast.Option>) {
    return this.generateToast(msg, "none", options);
  }

  success(msg: string, options?: Partial<Taro.showToast.Option>) {
    return this.generateToast(msg, "success", options);
  }

  fail(msg: string, options?: Partial<Taro.showLoading.Option>) {
    return this.generateToast(msg, "error", options);
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
