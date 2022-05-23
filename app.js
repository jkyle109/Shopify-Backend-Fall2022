const express = require("express");
const cors = require("cors");
const { marked } = require("marked");
const fs = require("fs");

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
  const md = fs.readFileSync(__dirname + "/README.md", "utf8");
  const html = marked.parse(md);

  res.status(200).send(html);
});

app.use("/items", itemRoutes);

module.exports = app;
