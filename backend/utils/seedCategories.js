const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();

const categories = [
  { name: "Smartphones", slug: "smartphones" },
  { name: "Automobiles", slug: "automobiles" },
  { name: "Robotics", slug: "robotics" },
  { name: "Home Appliances", slug: "home-appliances" },
  { name: "Wearables", slug: "wearables" },
  { name: "Laptops & PCs", slug: "laptops-pcs" },
  { name: "AI & Future Tech", slug: "ai-future-tech" },
  { name: "Reviews", slug: "reviews" },
  { name: "Comparisons", slug: "comparisons" },
  { name: "How-To / Guides", slug: "how-to-guides" }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Category.insertMany(categories);
    console.log("✅ Categories seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
