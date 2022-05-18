const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, (err) => {
  if (err) console.log(err);
  else console.log("db connected");
});

const db = mongoose.connection;

module.exports = db;
