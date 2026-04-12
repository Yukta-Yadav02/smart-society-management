const mongoose = require("mongoose");
const Wing = require("../models/Wing");
require("dotenv").config();

async function seedWings() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DB connected");

  const wings = ["A", "B", "C", "D"];

  for (const name of wings) {
    const exists = await Wing.findOne({ name });
    if (!exists) {
      await Wing.create({ name });
      console.log(`Wing ${name} created`);
    } else {
      console.log(`Wing ${name} already exists`);
    }
  }

  await mongoose.disconnect();
  console.log("Done!");
}

seedWings();
