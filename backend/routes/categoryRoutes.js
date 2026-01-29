const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  getCategoryBySlug
} = require("../controllers/categoryController");

// GET → frontend
router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

// POST → admin / seed
router.post("/", createCategory);

module.exports = router;
