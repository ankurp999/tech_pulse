const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");



const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  getTrendingBlogs,
  getMyBlogs,
  getBlogById,
  updateBlog
} = require("../controllers/blogController");

// public routes
router.get("/", getAllBlogs);
router.get("/trending", getTrendingBlogs);

// protected routes
router.get("/my", protect, getMyBlogs);
router.get("/edit/:id", protect, getBlogById);
router.put("/:id", protect, upload.single("coverImage"), updateBlog);
router.post("/", protect, upload.single("coverImage"), createBlog);

// param routes (must be last)
router.get("/:slug", getBlogBySlug);

module.exports = router;
