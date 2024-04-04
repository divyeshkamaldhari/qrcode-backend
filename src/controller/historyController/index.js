const { product } = require("../../model");

// For product history list
const getAllProductHistory = async (req, res) => {
  try {
    const allProducts = await product.find();
    const productList = await allProducts.filter(
      (product) =>
        product.isArchive === false && product.Customer_Checked === true
    );
    return res
      .status(200)
      .json({ status: true, message: "Product history", data: productList });
  } catch (error) {
    return res
      .status(500)
      .json({ status: true, message: "Internal server error", error });
  }
};

module.exports = { getAllProductHistory };
