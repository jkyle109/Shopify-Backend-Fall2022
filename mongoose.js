const mongoose = require("mongoose");
require("dotenv").config();

const db = mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true },
  (err) => {
    if (err) console.log(err);
    else console.log("db connected");
  }
);
