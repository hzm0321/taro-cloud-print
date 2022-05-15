import Taro from "@tarojs/taro";

const defaultOptions = {
  confirmColor: "#36b7ab",
};

interface OptionProps extends Taro.showModal.Option {
  onOk?: () => void;
  onCancel?: () => void;
}

export default ({ onOk, onCancel, ...options }: OptionProps) => {
  return Taro.showModal({
    success: function (res) {
      if (res.confirm) {
        onOk && onOk();
      } else if (res.cancel) {
        onCancel && onCancel();
      }
    },
    ...defaultOptions,
    ...options,
  });
};
