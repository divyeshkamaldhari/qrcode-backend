const { Router } = require("express");
const multer = require("multer");
const { productController } = require("../../controller");
const auth = require("../../middleware/auth");

const upload = multer();
const productRouter = new Router();

// CREATE PRODUCT
productRouter.post(
  "/createProduct",
  upload.none(),
  productController?.createProduct
);

// GET ALL PRODUCT
productRouter.get(
  "/getAllProducts",
  upload.none(),
  productController?.getAllProduct
);

// Missing Products
productRouter.get(
  "/getMissingProducts",
  upload.none(),
  productController?.getMissingProducts
);

// GET SINGLE PRODUCT
productRouter.get(
  "/getSingleProduct",
  upload.none(),
  productController?.getSingleProduct
);

// ARCHIEV PRODUCTS
productRouter.put(
  "/archiveProduct",
  upload.none(),
  productController?.archiveProducts
);

// Get ShipmentDetails
productRouter.get(
  "/getShipments",
  upload.none(),
  productController?.getShipmentDetails
);

// UNARCHIVE PRODUCT
productRouter.put(
  "/unArchiveProduct",
  upload.none(),
  productController?.unArchiveProduct
);

// GET ARCHIVE PRODUCTS
productRouter.get(
  "/getArchiveProduct",
  upload.none(),
  productController?.getArchiveProducts
);
// DELETE PRODUCT
productRouter.delete(
  "/deleteProduct",
  upload.none(),
  productController?.deleteProduct
);

// UPDATE PRODUCT
productRouter.put(
  "/updateProduct",
  upload.none(),
  productController?.updateProduct
);

// SCANE PRODUCT
productRouter.put("/scaneProduct", productController?.scaneProduct);

// SEARCH PRODUCT
productRouter.put("/searchProduct", productController?.searchProducts);

// SEARCH ARCHIVE PRODUCT
productRouter.put(
  "/searchArchiveProduct",
  productController?.searchArchiveProduct
);
module.exports = {
  productRouter,
};
