const { batch, product, user } = require("../../model");

//For create batch
const createBatch = async (req, res) => {
  try {
    const userId = req.userId;
    const { batchDetails, productId, batchId, createdFrom } = req.body;
    let batchProduct = {};
    // check for batch already exist
    const isExistBatch = await batch.findOne({
      batchName: batchDetails?.batchName,
      productId: productId,
    });
    if (isExistBatch) {
      return res.status(409).json({ message: "Batch name alredy exist " });
    }
    if (productId) {
      batchProduct = await product.findOne({ _id: productId });
    } else {
      data = await batch.findOne({ _id: batchId });
      batchProduct = data.productDetails;
    }
    const newBatch = new batch({
      batchName: batchDetails?.batchName,
      assign_to: batchDetails?.assign_to,
      stockCount: batchDetails?.stockCount,
      creater: userId,
      productId: productId,
      createdFrom: createdFrom ? productId : batchId,
      productDetails: batchProduct,
    });
    await newBatch.populate("assign_to");
    await newBatch.save();
    return res.status(200).json({
      status: true,
      message: "Batch added",
      data: newBatch,
      updatedProduct: batchProduct,
    });
  } catch (error) {
    console.log(error);
  }
};

//For update batch
const updateBatch = async (req, res) => {
  try {
    const userId = req.userId;
    const batchId = req.query.id;
    const { batchDetails, productId } = req.body;

    let updatedBatchDetails = {};
    let updatedProductDetails = {};
    //Check for exist batch details
    const isExistBatch = await batch.findOne({ $or: [{ creater: userId }] });
    //Check for product details
    ProductDetails = await product.findById(productId);

    if (isExistBatch) {
      updatedBatchDetails = await batch
        .findByIdAndUpdate(
          batchId,
          {
            batchName: batchDetails?.batchName,
            assign_to: batchDetails?.assign_to,
            stockCount: batchDetails?.stockCount,
            productDetails: ProductDetails,
          },
          { new: true }
        )
        .populate("assign_to");
    } else {
      updatedBatchDetails = await batch
        .findByIdAndUpdate(
          batchId,
          {
            batchName: batchDetails?.batchName,
            $push: { assign_to: batchDetails?.assign_to },
            stockCount: batchDetails?.stockCount,
            productDetails: ProductDetails,
          },
          { new: true }
        )
        .populate("assign_to");
    }
    return res.json({
      status: true,
      message: "Batch updated successfully",
      data: updatedBatchDetails,
    });
  } catch (error) {
    console.log(error);
  }
};

// for get single batch
const getBatch = async (req, res) => {
  try {
    const batchId = req.query.id;    
    const batchDetails = await batch.findById(batchId).populate("scanner_user").populate('assign_to');
    return res
      .status(200)
      .json({ status: true, mesage: "Batch details", data: batchDetails });
  } catch (error) {
    console.log(error);
  }
};

// For get all batchs
const getAllBatchs = async (req, res) => {
  try {
    const userId = req.userId;
    const userDetails = await user.findById(userId);
    let batchList = [];
    if (userDetails?.scope === "Super_Admin") {
      batchList = await batch
        .find({})
        .populate("creater")
        .populate("assign_to");
    } else {
      batchList = await batch
        .find({
          $or: [{ creater: userId }, { assign_to: userId }],
        })
        .populate("creater")
        .populate("assign_to");
    }
    return res
      .status(200)
      .json({ status: true, message: "All Batchs", data: batchList });
  } catch (error) {
    console.log(error);
  }
};

// For scan batch
const scanBatch = async (req, res) => {
  try {
    const batchId = req.query.id;
    const { userId, nextScane, lastScane, scanCount, isChecked } = req.body;
    const data = await batch.findOne({ _id: batchId });

    const scannedBatch = await batch
      .findByIdAndUpdate(
        batchId,
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
          },
        },
        { new: true }
      )
      .populate({ path: "scanner_user", strictPopulate: false });
    return res.status(200).json({
      status: true,
      message: "Scanned successfull",
      data: scannedBatch,
    });
  } catch (error) {}
};

//For search batch
const searchBatch = async (req, res) => {
  try {
    const searchParameter = req.query.search;

    let searchQuery = {};

    if (searchParameter) {
      searchQuery.$or = [
        { batchName: { $regex: searchParameter, $options: "i" } },
      ];
    }
    const searchBatch = await batch.find(searchQuery);
    return res
      .status(200)
      .json({ status: 200, message: "Batches", data: searchBatch });
  } catch (error) {
    console.log(error);
  }
};

//For delete batch
const deleteBatch = async (req, res) => {
  try {
    const userId = req.userId;
    const batchId = req.query.id;
    const isBatchExist = await batch.findOne({
      $and: [{ creater: userId }, { _id: batchId }],
    });
    if (!isBatchExist) {
      return res
        .status(401)
        .json({ status: true, message: "Only creater can delete this batch." });
    }
    const deletedBatch = await batch.findByIdAndDelete(batchId);

    return res
      .status(200)
      .json({ status: 200, message: "batchDeleted", data: deletedBatch });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createBatch,
  updateBatch,
  getBatch,
  getAllBatchs,
  scanBatch,
  searchBatch,
  deleteBatch,
};
