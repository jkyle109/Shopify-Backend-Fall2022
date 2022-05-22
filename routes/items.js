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
    if (item instanceof Error) return res.status(400).send(errJson(item));
    if (!item) return res.status(404).send(errJson(`Id ${id} not found.`));

    if (item.deleted) {
      const result = await Items.findByIdAndDelete(id).catch(errLogger);
      if (result instanceof Error) return res.status(400).send(errJson(result));
      return res.status(200).send(result);
    }
    // This will trigger mongodb to set a TTL of 1 day
    item.deleted = true;
    item.deleteComment = data.deleteComment || item.deleteComment;
    item.lastUpdated = Date.now();
    const result = await item.save();
    return res.status(200).send(result);
  } catch (err) {
    return res.status(400).send(errJson(err));
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
    data._id = new bson.ObjectId();
    const item = new Items(data);
    const result = await item.save();
    return res.status(201).send(result);
  } catch (err) {
    return res.status(404).send(errJson(err));
  }
});

// Edit
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  // Check if valid ObjectId
  if (!ObjectId.isValid(id))
    return res.status(404).send(errJson("Invalid item id type."));

  // Should not be able to edit these fields
  if (data._id || data.lastUpdated)
    return res
      .status(400)
      .send(errJson("Cannot edit id or last updated field"));

  const item = new Items(data);
  // Unset default generated ObjectID
  item._id = undefined;

  const result = await Items.findByIdAndUpdate(id, item, { new: true }).catch(
    errLogger
  );
  if (result instanceof Error) return res.status(400).send(errJson(result));
  if (!result) return res.status(404).send(errJson(`Id ${id} not found.`));
  return res.status(200).send(result);
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

// Individual (either deleted or not)
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  // Check if valid ObjectId
  if (!ObjectId.isValid(id))
    return res.status(404).send(errJson("Invalid item id type."));

  const item = await Items.findById(id).catch(errLogger);
  if (item instanceof Error) return res.status(400).send(errJson(item));
  if (!item) return res.status(404).send(errJson(`Id ${id} not found.`));

  return res.status(200).send(item);
});

const getAllItems = async (res, query = {}) => {
  const result = await Items.find(query).catch(errLogger);
  if (result instanceof Error) return res.status(400).send(errJson(result));
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
