const router = require("express").Router();
const Items = require("../models/itemModel.js");
const bson = require("bson");
const { ObjectId } = require("mongoose").Types;

// Delete
// Set TTL instead of actually deleteing the file.
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    // Check if valid ObjectId
    if (!ObjectId.isValid(id))
      return res.status(404).send(errJson("Invalid item id type."));

    const item = await Items.findById(id).catch(errLogger);
    if (item instanceof Error) return res.status(400).send(item);
    if (!item) return res.status(404).send(errJson(`Id ${id} not found.`));

    if (item.deleted) {
      const confirm = await Items.findByIdAndDelete(id).then(errLogger);
      if (confirm instanceof Error) return res.status(400).send(item);
      return res.status(200).send(confirm);
    }
    // This will trigger mongodb to set a TTL of 1 day
    item.deleted = true;
    item.deleteComment = data.deleteComment || item.deleteComment;
    item.lastUpdated = Date.now();
    const result = await item.save();
    console.log(result);
    return res.status(200).send(item);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Restore
router.patch("restore/:id", async (req, res) => {
  res.status(200).send("Restore a deleted item.");
});

// Create
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const item = new Items({
      _id: new bson.ObjectId(),
      name: data.name,
      amount: data.amount,
      price: data.price,
      description: data.description,
      lastUpdated: Date.now(),
      deleted: data.deleted,
      deletedComment: data.deletedComment,
    });
    const result = await item.save();
    return res.status(201).send(result);
  } catch (err) {
    // console.log(err);
    return res.status(404).send(err);
  }
});

// Edit
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  // Check if valid ObjectId
  if (!ObjectId.isValid(id))
    return res.status(404).send(errJson("Invalid item id type."));

  const item = await Items.findById(id).catch(errLogger);
  if (item instanceof Error) return res.status(400).send(item);
  if (!item) return res.status(404).send(errJson(`Id ${id} not found.`));

  try {
    item._id = data._id || item._id;
    item.name = data.name || item.name;
    item.amount = data.amount || item.amount;
    item.price = data.price || item.price;
    item.description = data.description || item.description;
    item.deleteComment = data.deleteComment || item.deleteComment;
    item.lastUpdated = Date.now();
    item.deleted = data.deleted || item.deleted;
    item.deletedComment = data.deletedComment || item.deletedComment;
    item.expireAfterSeconds =
      data.expireAfterSeconds || item.expireAfterSeconds;
    item.save();
    return res.status(200).send(item);
  } catch (err) {
    // console.log(err);
    return res.status(400).send(err);
  }
});

// View
// All deleted
router.get("/deleted", (req, res) => {
  getAllItems(res, { deleted: true });
});

// All not deleted
router.get("/", (req, res) => {
  getAllItems(res, { deleted: false });
});

// Individual (either, or)
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  // Check if valid ObjectId
  if (!ObjectId.isValid(id))
    return res.status(404).send(errJson("Invalid item id type."));

  const item = await Items.findById(id).catch(errLogger);
  if (item instanceof Error) return res.status(400).send(item);
  if (!item) return res.status(404).send(errJson(`Id ${id} not found.`));

  return res.status(200).send(item);
});

const getAllItems = async (res, query = {}) => {
  const result = await Items.find(query).catch(errLogger);
  if (result instanceof Error) return res.status(400).send(result);
  if (!result) return res.status(404).send(errJson("Error loading items."));
  return res.status(200).send(result);
};

const errLogger = (err) => {
  // console.log(err);
  return err;
};

errJson = (reason) => {
  return { error: reason };
};

module.exports = router;
