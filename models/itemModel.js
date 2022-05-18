const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: false },
  lastUpdated: { type: Date, required: true, default: Date.now },
  deleted: { type: Boolean, required: true, default: false },
});

// Add TTL to each item if they have been deleted.
ItemSchema.index(
  { expireAt: 1 },
  {
    expireAfterSeconds: 24 * 60 * 60, // 1 day
    partialFilterExpression: { deleted: true },
  }
);

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
