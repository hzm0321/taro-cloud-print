const Order = require("../../../controllers/order");

class Router {

  constructor() {
    const tasks = [];
  }

  get(path, func) {
    console.log(path);
  }
}

const router = new Router();

router.get("/", Order.submit);

module.exports = router;
