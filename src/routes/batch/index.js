const { Router } = require("express");
const multer = require("multer");
const { batchController } = require("../../controller");
const upload = multer();

const batchRouter = new Router();

//FOR CREATE BATCH ROUTE
batchRouter.post("/createBatch", upload.none(), batchController?.createBatch);

//FOR UPDATE BATCH ROUTE
batchRouter.put("/updateBatch", upload.none(), batchController?.updateBatch);

//FOR GET SINGLE BATCH ROUTE
batchRouter.get("/getBatch", upload.none(), batchController?.getBatch);

//FOR GET ALL BATCH ROUTE
batchRouter.get("/getAllBatch", upload.none(), batchController?.getAllBatchs);

//FOR SCAN BATCH ROUTE
batchRouter.put("/scanBatch", upload.none(), batchController?.scanBatch);

//FOR SEARCH BATCH ROUTE
batchRouter.put("/searchBatch", upload.none(), batchController?.searchBatch);

//FOR DELETE BATCH ROUTE
batchRouter.delete("/deleteBatch", upload.none(), batchController?.deleteBatch);

module.exports = { batchRouter };
