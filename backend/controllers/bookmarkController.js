const User = require("../models/User");
const Blog = require("../models/Blog");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * Toggle bookmark (save/unsave)
 * POST /api/bookmarks/:blogId
 */
exports.toggleBookmark = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const user = await User.findById(userId);
  const index = user.savedBlogs.indexOf(blogId);

  let saved;
  if (index === -1) {
    user.savedBlogs.push(blogId);
    saved = true;
  } else {
    user.savedBlogs.splice(index, 1);
    saved = false;
  }

  await user.save();

  res.status(200).json({
    success: true,
    saved,
    savedCount: user.savedBlogs.length,
  });
});

/**
 * Get all saved blogs
 * GET /api/bookmarks
 */
exports.getSavedBlogs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedBlogs",
    match: { status: "published" },
    populate: [
      { path: "category", select: "name slug" },
      { path: "author", select: "username email" },
    ],
    options: { sort: { publishedAt: -1 } },
  });

  // Filter out nulls (deleted blogs)
  const blogs = (user.savedBlogs || []).filter(Boolean);

  res.status(200).json({ success: true, blogs });
});

/**
 * Check if a blog is bookmarked
 * GET /api/bookmarks/check/:blogId
 */
exports.checkBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const saved = user.savedBlogs.includes(req.params.blogId);

  res.status(200).json({ success: true, saved });
});
