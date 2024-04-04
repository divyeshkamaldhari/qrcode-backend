const { product } = require("../../model");
// For create product
const createProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      productId,
      productName,
      productPrice,
      sku,
      category,
      weight,
      stockCount,
      test,
      testStatus,
      testDate,
      delta9THC,
      HHCAcetate,
      cannabinoidsPercent,
      moistureContent,
      foreignMatter,
      internalStandardNormalization,
      cannabinoids,
      residualSolvents,
      heavyMetals,
      deliveryDate,
    } = req.body;

    const newProduct = new product({
      creater: userId,
      productId,
      productName,
      productPrice,
      sku,
      category,
      weight: JSON.parse(weight),
      stockCount: JSON.parse(stockCount),
      test,
      testStatus,
      testDate,
      delta9THC,
      HHCAcetate,
      cannabinoidsPercent,
      moistureContent,
      foreignMatter,
      internalStandardNormalization,
      cannabinoids: JSON.parse(cannabinoids),
      residualSolvents: JSON.parse(residualSolvents),
      heavyMetals: JSON.parse(heavyMetals),
      deliveryDate,
    });
    await newProduct.save();

    return res.status(200).json({
      status: true,
      message: "Product Added",
      data: newProduct,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

// For get all products
const getAllProduct = async (req, res) => {
  try {
    //For list of products
    const products = await product.find().sort({ createdAt: "asc" }).populate({
      path: "scanner_user",
      strictPopulate: false,
    });

    // List for products that is not in archive
    const productList = await products.filter(
      (item) => item.isArchive === false && item?.Customer_Checked == false
    );
    const masterDistributorProduct = productList?.filter((item) => {
      return item.scanner_user.some(
        (user) => user.role === "Master_Distributor"
      );
    });

    const subDistributorProduct = productList?.filter((item) => {
      return item.scanner_user.some((user) => user.role === "Sub_Distributor");
    });
    const retailerProduct = productList?.filter((item) => {
      return item.scanner_user.some((user) => user.role === "Retailers");
    });
    // const masterDistributor = await productList?.filter((product) =>
    //   product?.scanner_user?.filter((v) => v.role === "Master_Distributor")
    // );

    //Count of product which only sub distributor  has scane
    // const sub_distributor_Count = await productList.filter(
    //   (product) => product.sub_distributor_Checked
    // );

    //Count of product which only retailer  has scane
    const retailers_Count = await productList.filter(
      (product) => product.retailers_Checked
    );

    //Count of product which only customer has scane
    const customers_Count = await productList.filter(
      (product) => product.customers_Checked
    );
    res.status(200).json({
      status: true,
      message: "Product listed",
      data: productList,
      masterDistributorProduct: masterDistributorProduct,
      subDistributorProduct: subDistributorProduct,
      retailerProduct: retailerProduct,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

// For get missing product
const getMissingProducts = async (req, res) => {
  try {
    const products = await product.find().populate({
      path: "scanner_user",
      strictPopulate: false,
    });
    const masterDistributorProducts = products.filter(
      (product) =>
        product?.wareHouse_Checked === true &&
        product?.Master_Distributor_Checked === true
    );
    const subMasterProducts = masterDistributorProducts.filter(
      (product) =>
        product?.Master_Distributor_Checked === true &&
        product?.Sub_Distributor_Checked === true
    );
    const retailersProduct = subMasterProducts?.filter(
      (subproduct) => subproduct?.Retailers_Checked === true
    );

    const masterNotInSubMaster = masterDistributorProducts.filter(
      (product) =>
        product?.Master_Distributor_Checked === true &&
        product?.Sub_Distributor_Checked !== true
    );
    // const missingPorductByMaster = products?.filter(
    //   (product) =>
    //     product?.Master_Distributor_Checked === false &&
    //     (current_date - product?.createdAt) / (1000 * 60 * 60 * 24) > 2
    // );
    const missingPorductBySubMaster = masterDistributorProducts?.filter(
      (product) =>
        product?.Sub_Distributor_Checked === false &&
        (current_date - product?.createdAt) / (1000 * 60 * 60 * 24) > 4
    );
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: true, message: "Internal server error", error });
  }
};

// For get single product
const getSingleProduct = async (req, res) => {
  try {
    const productDetails = await product
      .findOne({ _id: req.headers.id })
      .populate({
        path: "scanner_user",
        strictPopulate: false,
      });
    res.status(200).json({
      status: true,
      message: "Product listed",
      data: productDetails,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

// For delete product
const deleteProduct = async (req, res) => {
  try {
    const productDelete = await product.findByIdAndDelete(req.query.id);

    if (!productDelete) {
      return res.status(200).json({
        status: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Product Deleted",
      data: productDelete,
    });
  } catch (err) {
    res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

// For archive product
const archiveProducts = async (req, res) => {
  try {
    const Product = await product.findByIdAndUpdate(
      req.body.id,
      { isArchive: req.body.isArchive },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      message: "Successfully moved to archive",
      data: Product,
    });
  } catch (error) {
    return res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

// For get archive Product data
const getArchiveProducts = async (req, res) => {
  try {
    const allProduct = await product.find();
    const archiveProducts = await allProduct.filter(
      (item) => item.isArchive === true
    );
    res.status(200).json({
      status: true,
      message: "Archive data",
      data: archiveProducts,
    });
  } catch (error) {
    res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

// For unArchive product
const unArchiveProduct = async (req, res) => {
  try {
    const unArchive = await product.findByIdAndUpdate(
      req.body.id,
      {
        isArchive: req.body.isArchive,
      },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "UnArchive data",
      data: unArchive,
    });
  } catch (error) {
    res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      productName,
      productPrice,
      sku,
      category,
      weight,
      stockCount,
      test,
      testStatus,
      testDate,
      delta9THC,
      HHCAcetate,
      cannabinoidsPercent,
      moistureContent,
      foreignMatter,
      internalStandardNormalization,
      cannabinoids,
      residualSolvents,
      heavyMetals,
      deliveryDate,
    } = req.body;
    const data = await product.findByIdAndUpdate(
      req.query.id,
      {
        productId,
        productName,
        productPrice: JSON.parse(productPrice),
        sku,
        category,
        weight: JSON.parse(weight),
        stockCount: JSON.parse(stockCount),
        test,
        testStatus,
        testDate,
        delta9THC,
        HHCAcetate,
        cannabinoidsPercent,
        moistureContent,
        foreignMatter,
        internalStandardNormalization,
        cannabinoids: JSON.parse(cannabinoids),
        residualSolvents: JSON.parse(residualSolvents),
        heavyMetals: JSON.parse(heavyMetals),
        deliveryDate,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: 200, message: "update product succesfull", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ status: 200, message: "Error occurred while updating", error });
  }
};
// Scane Product
const scaneProduct = async (req, res) => {
  try {
    const batchId = req.query.id;
    const { userId, nextScane, lastScane, scanCount, isChecked } = req.body;
    const data = await product.findOne({ _id: batchId });

    const scannedProduct = await product
      .findByIdAndUpdate(
        req.query.id,
        {
          $push: { scanner_user: userId },
          $set: {
            nextScane: nextScane,
            lastScane: lastScane,
            scanCount: scanCount,
            wareHouse_Checked:
              isChecked === "wareHouse_Checked"
                ? true
                : data?.wareHouse_Checked,
            Master_Distributor_Checked:
              isChecked === "Master_Distributor_Checked"
                ? true
                : data?.Master_Distributor_Checked,
            Sub_Distributor_Checked:
              isChecked === "Sub_Distributor_Checked"
                ? true
                : data?.Sub_Distributor_Checked,
            Retailers_Checked:
              isChecked === "Retailers_Checked"
                ? true
                : data?.Retailers_Checked,
            Customer_Checked:
              isChecked === "Customer_Checked" ? true : data?.Customer_Checked,
          },
        },
        { new: true }
      )
      .populate({ path: "scanner_user", strictPopulate: false });
    return res.status(200).json({
      status: true,
      message: "Scanned successfull",
      data: scannedProduct,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: true, message: "Internal server error", error });
  }
};

// For search product
const searchProducts = async (req, res) => {
  try {
    const searchParameter = req.query.search;

    let searchQuery = { isArchive: false, Customer_Checked: false };

    if (searchParameter) {
      searchQuery.$or = [
        { productName: { $regex: searchParameter, $options: "i" } },
        { productId: { $regex: searchParameter, $options: "i" } },
        { category: { $regex: searchParameter, $options: "i" } },
        { sku: { $regex: searchParameter, $options: "i" } },
      ];
    }

    const searchProduct = await product.find(searchQuery);

    res.status(200).json({
      data: searchProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while searching for products.",
    });
  }
};

// For search anrchive Products
const searchArchiveProduct = async (req, res) => {
  try {
    const searchParameter = req.query.search;

    let searchQuery = { isArchive: true };

    if (searchParameter) {
      searchQuery.$or = [
        { productName: { $regex: searchParameter, $options: "i" } },
        { productId: { $regex: searchParameter, $options: "i" } },
        { category: { $regex: searchParameter, $options: "i" } },
        { sku: { $regex: searchParameter, $options: "i" } },
      ];
    }

    const searchProduct = await product.find(searchQuery);

    res.status(200).json({
      data: searchProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while searching for products.",
    });
  }
};
// get Shipment Details
const getShipmentDetails = async (req, res) => {
  try {
    //For list of products
    const products = await product.find().sort({ createdAt: "asc" }).populate({
      path: "scanner_user",
      strictPopulate: false,
    });

    // List for products that is not in archive
    const productList = await products.filter(
      (item) => item.isArchive === false
    );
    res.status(200).json({
      status: true,
      message: "Product listed",
      data: productList,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while searching for products.",
    });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getMissingProducts,
  deleteProduct,
  updateProduct,
  searchProducts,
  searchArchiveProduct,
  getSingleProduct,
  archiveProducts,
  getArchiveProducts,
  unArchiveProduct,
  scaneProduct,
  getShipmentDetails,
};
