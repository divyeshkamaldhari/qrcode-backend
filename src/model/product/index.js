const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    scanner_user: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    creater: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    productId: {
      type: String,
    },
    productName: {
      type: String,
    },
    productPrice: { type: String },
    sku: {
      type: String,
    },
    category: {
      type: String,
    },
    weight: {
      type: Number,
    },
    stockCount: {
      type: Number,
    },
    test: {
      type: String,
    },
    testStatus: {
      type: String,
    },
    testDate: {
      type: Date,
    },
    delta9THC: { type: String },
    HHCAcetate: { type: String },
    cannabinoidsPercent: { type: Number },
    moistureContent: { type: String },
    foreignMatter: { type: String },
    internalStandardNormalization: { type: String },
    cannabinoids: { type: Array },
    residualSolvents: { type: Array },
    heavyMetals: { type: Array },
    scanDateTime: { type: Date },
    scanLocation: { type: String },
    nextScane: { type: String },
    lastScane: { type: String },
    scanCount: { type: Number, default: 0 },
    wareHouse_Checked: { type: Boolean, default: true },
    Master_Distributor_Checked: { type: Boolean, default: false },
    Sub_Distributor_Checked: { type: Boolean, default: false },
    Retailers_Checked: { type: Boolean, default: false },
    Customer_Checked: { type: Boolean, default: false },
    deliveryDate: { type: Date },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const product = mongoose.model("product", productSchema);
module.exports = product;
