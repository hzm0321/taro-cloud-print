/**
 * 计算订单行价格和总价格
 * @param files 文件列表
 * @param prices 价格列表
 * @param bindPrices 装订价格表
 */

function calcOrderPriceUtil(files, prices, bindPrices) {
  const freightLimit = 19 * 100; // 快递费计算阈值
  const freightNumber = 9 * 100; // 快递费
  const priceMap = new Map();
  // 生成价格映射表
  prices.forEach((item) => {
    const { type, size, color, face, price } = item;
    const key = type + size + color + face;
    priceMap.set(key, price);
  });

  // 计算订单行价格
  const filesPrice = files.map((file) => {
    const { type, size, color, face, bind, count, number } = file;
    const key = type + size + color + face;
    const filePrice = priceMap.get(key) || 0; // 单价
    const bindPrice = bindPrices[bind]; // 装订费用
    const calcNumber = face === "double" ? Math.ceil(number / 2) : number; // 纸张数
    // 计算规则: (纸张数 * 单价 + 装订费用) * 份数
    return (filePrice * calcNumber + bindPrice) * count;
  });
  // 计算订单行总价格
  const totalFilesPrice = filesPrice.reduce((pre, cur) => pre + cur);
  let totalPrice = totalFilesPrice;
  let freightPrice = 0;
  if (totalFilesPrice < freightLimit) {
    freightPrice = freightNumber;
    totalPrice += freightNumber;
  }
  return {
    totalPrice, // 总价格
    freightPrice, // 运费价格
    filesPrice,
  };
}

module.exports = {
  calcOrderPriceUtil,
};
