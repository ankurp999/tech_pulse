const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const {
  createTag,
  getAllTags,
  getTagBySlug
} = require("../controllers/tagController");

// PUBLIC
router.get("/", getAllTags);
router.get("/:slug", getTagBySlug);

// ADMIN (baad mein auth lagayenge)
router.post("/", protect, adminOnly, createTag);

module.exports = router;
