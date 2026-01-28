const mongoose = require("mongoose");

const wingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // A, B, C, D
  },
});

module.exports = mongoose.model("Wing", wingSchema);