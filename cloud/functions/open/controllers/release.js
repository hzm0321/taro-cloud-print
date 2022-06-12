const axios = require("axios");

class Release {
  /**
   * 生成订单
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  async releaseList(ctx, next) {
    const {
      _req: {
        event: { cloud },
      },
    } = ctx;

    const res = await axios.get(
      "https://api.github.com/repos/hzm0321/taro-cloud-print/releases"
    );

    if (res.status === 200) {
      ctx.body = {
        success: true,
        data: res.data,
      };
    } else {
      ctx.body = {
        success: false,
        data: "接口查询错误",
      };
    }
  }
}

module.exports = new Release();
