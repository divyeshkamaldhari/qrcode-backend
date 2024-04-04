const { Router } = require("express");
const { productRouter } = require("./product");
const { historyRouter } = require("./history");
const { userRouter } = require("./user");
const auth = require("../middleware/auth");
const { batchRouter } = require("./batch");

const mainRouter = new Router();

// ROUTE FOR PRODUCTS
mainRouter.use("/product", auth, productRouter);

// ROUTE FOR BATCHES
mainRouter.use("/batch", auth, batchRouter);
//ROUTES FOR HISTORY
mainRouter.use("/history", auth, historyRouter);
//ROUTE FOR USER
mainRouter.use("/user", userRouter);

module.exports = {
  mainRouter,
};
