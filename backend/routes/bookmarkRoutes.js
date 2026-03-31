const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  toggleBookmark,
  getSavedBlogs,
  checkBookmark,
} = require("../controllers/bookmarkController");

router.get("/", protect, getSavedBlogs);
router.get("/check/:blogId", protect, checkBookmark);
router.post("/:blogId", protect, toggleBookmark);

module.exports = router;
