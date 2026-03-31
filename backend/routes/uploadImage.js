const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // same multer config
const { protect } = require("../middlewares/authMiddleware");

// Inline image upload – protected (only logged-in users)
router.post("/image", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    // Cloudinary URL is in req.file.path
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;