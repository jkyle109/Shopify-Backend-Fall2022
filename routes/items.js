const router = require("express").Router();
const Items = require("../models/itemModel.js");
const { ObjectId } = require("mongoose").Types;

// Create
router.post("/", (req, res) => {
  res.status(200).send("Create a new inventory item.");
});

// Edit
router.patch("/:id", (req, res) => {
  res.status(200).send("Edit an existing item.");
});

// Delete
router.delete("/:id", async (req, res) => {
  res.status(200).send("Delete an existing item.");
});

// Restore
router.put("/:id", async (req, res) => {
  res.status(200).send("Restore a deleted item.");
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
  let id = req.params.id;
  console.log(id);

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
