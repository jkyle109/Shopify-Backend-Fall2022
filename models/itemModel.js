const mongoose = require("mongoose");
const db = require("../mongoose.js");
const ObjectId = require("mongoose").Types.ObjectId;
const d = new Date();
const ItemSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: false },
  description: { type: String, required: false },
  lastUpdated: { type: Date, required: true, default: Date.now },
  deleted: { type: Boolean, required: true, default: false },
  deleteComment: { type: String, required: false },
});

// Add TTL to each item if they have been deleted.
ItemSchema.index(
  { expireAt: 1 },
  {
    expireAfterSeconds: 24 * 60 * 60, // 1 day
    partialFilterExpression: { deleted: true },
  }
);

const Items = db.model("Items", ItemSchema);
module.exports = Items;
