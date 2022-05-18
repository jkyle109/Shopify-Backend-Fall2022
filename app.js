const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", (req, res) => {
  res.status(200).send("Instructions and form.");
});

app.use("/items", (req, res) => {
  res.status(200).send("Item routes");
});

module.exports = app;
