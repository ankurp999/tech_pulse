const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  toggleLikeBlog
} = require("../controllers/likeController");

// 👍 Like
router.post("/:blogId/like", protect, toggleLikeBlog);

// 👎 Unlike
router.post("/:blogId/unlike", protect, toggleLikeBlog);

module.exports = router;
