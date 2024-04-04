const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batchName: { type: String },
  productDetails: { type: Object },
  createdFrom: { type: String },
  productId: { type: String },
  stockCount: { type: Number, default: 0 },
  creater: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  scanner_user: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  assign_to: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  wareHouse_Checked: { type: Boolean, default: true },
  Master_Distributor_Checked: { type: Boolean, default: false },
  Sub_Distributor_Checked: { type: Boolean, default: false },
  Retailers_Checked: { type: Boolean, default: false },
  scanCount: { type: Number, default: 0 },
  lastScane: { type: String },
  nextScane: { type: String },
});

const batch = mongoose.model("batch", batchSchema);
module.exports = batch;
