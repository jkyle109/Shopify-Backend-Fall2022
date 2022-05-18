const router = require("express").Router();
const Items = require("../models/itemModel.js");
const { ObjectId } = require("mongoose").Types;

// Delete
router.delete("/:id", async (req, res) => {
  res.status(200).send("Delete an existing item.");
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
      _id: data._id,
      name: data.name,
      amount: data.amount,
      price: data.price,
      description: data.description,
      deleteComment: data.deleteComment,
      lastUpdated: data.lastUpdated,
      deleted: data.deleted,
      deletedComment: data.deletedComment,
    });
    item.save();
    return res.status(201).send(item);
  } catch (err) {
    // console.log(err);
    return res.status(404).send(err);
  }
});

// Edit
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  // Check if valid ObjectId
  if (!ObjectId.isValid(id))
    return res.status(404).send(errJson("Invalid item id type."));

  const item = await Items.findById(id).catch(errLogger);
  if (item instanceof Error) return res.status(400).send(item);
  if (!item) return res.status(404).send(errJson(`Id ${id} not found.`));

  try {
    item._id = data._id;
    item.name = data.name || item.name;
    item.amount = data.amount || item.amount;
    item.price = data.price || item.price;
    item.description = data.description || item.description;
    item.deleteComment = data.deleteComment || item.deleteComment;
    item.lastUpdated = data.lastUpdated || item.lastUpdated;
    item.deleted = data.deleted || item.deleted;
    item.deletedComment = data.deletedComment || item.deletedComment;
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
  getAllItems(res);
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
