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

// protected (any logged-in user can create products for blogs)
router.post("/", protect, createProduct);

module.exports = router;
