const { Router } = require("express");
const multer = require("multer");
const { historyController } = require("../../controller");

const upload = multer();

const historyRouter = new Router();
historyRouter.get(
  "/getProductHistory",
  historyController?.getAllProductHistory
);
module.exports = {
  historyRouter,
};
