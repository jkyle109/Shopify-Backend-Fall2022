const express = require("express");
const cors = require("cors");

const itemRoutes = require("./routes/items.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Instructions and form.");
});

app.use("/items", itemRoutes);

module.exports = app;
