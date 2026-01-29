const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");




const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getTrendingBlogs
} = require("../controllers/blogController");

// public routes
router.get("/", getAllBlogs);
router.get("/trending", getTrendingBlogs);
router.get("/:slug", protect, getBlogBySlug);

// admin / internal
router.post("/", protect, adminOnly, createBlog);

module.exports = router;
