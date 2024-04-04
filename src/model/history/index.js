const mongoose = require("mongoose");

const historySchema = mongoose.Schema({
  data: {
    productId: {
      type: String,
    },
    productName: {
      type: String,
    },
    SKU: {
      type: String,
    },
    masterDistri: {
      type: String,
    },
    subDistri: {
        type: Number,
    },
    retailers: {
        type: Number,
    },
    consumer: {
        type: String,
    },
    totalCount: {
        type: String,
    }
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const history = mongoose.model("history", historySchema);
module.exports = history;
