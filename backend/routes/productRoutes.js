const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");


const {
  createProduct,
  getAllProducts,
  getProductBySlug
} = require("../controllers/productController");

// public
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// admin / internal
router.post("/", protect, adminOnly, createProduct);

module.exports = router;
