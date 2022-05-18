const router = require("express").Router();
const ItemModel = require("../models/itemModel.js");

// Create
router.post("/", (req, res) => {
  res.status(200).send("Create a new inventory item.");
});

// Edit
router.put("/:id", (req, res) => {
  res.status(200).send("Edit an existing item.");
});

// Delete
router.delete("/:id", (re, res) => {
  res.status(200).send("Delete an existing item.");
});

// View
// All
router.get("/", (req, res) => {
  res.status(200).send("List of all items.");
});

// Individual
router.get("/:id", (req, res) => {
  res.status(200).send("Individul item.");
});
