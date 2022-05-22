const mongoose = require("mongoose");
const db = require("../mongoose.js");
const { ObjectId } = require("mongoose").Types;
const bson = require("bson");
const ItemSchema = new mongoose.Schema(
  {
    _id: { type: ObjectId, required: true, default: new bson.ObjectId() },
    name: { type: String, required: false },
    amount: { type: Number, required: false, default: 0 },
    price: { type: Number, required: false, default: 0.0 },
    description: { type: String, required: false, default: "N/A" },
    lastUpdated: { type: Date, required: false, default: Date.now() },
    deleted: { type: Boolean, required: false, default: false },
    deleteComment: { type: String, required: false },
  },
  { strict: true }
);

// Add TTL to each item if they have been set to deleted.
ItemSchema.index(
  { lastUpdated: 1 },
  {
    expireAfterSeconds: 86400, // 1 day
    partialFilterExpression: { deleted: true },
  }
);

const Items = db.model("Items", ItemSchema);
module.exports = Items;
