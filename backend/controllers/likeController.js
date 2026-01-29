const Blog = require("../models/Blog");
const asyncHandler = require("../middlewares/asyncHandler");
const {calculateTrendingScore} = require("../utils/trendingHelper");

// =========================
// 👍 LIKE A BLOG
// =========================
// exports.likeBlog = async (req, res) => {
//   try {
//     const { blogId } = req.params;

//     const blog = await Blog.findById(blogId);

//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     blog.likesCount += 1;
//     await blog.save();

//     res.status(200).json({
//       message: "Blog liked",
//       likesCount: blog.likesCount
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // =========================
// // 👎 UNLIKE A BLOG
// // =========================
// exports.unlikeBlog = async (req, res) => {
//   try {
//     const { blogId } = req.params;

//     const blog = await Blog.findById(blogId);

//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     // negative likes se bachaav
//     if (blog.likesCount > 0) {
//       blog.likesCount -= 1;
//       await blog.save();
//     }

//     res.status(200).json({
//       message: "Blog unliked",
//       likesCount: blog.likesCount
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.toggleLikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const userId = req.user._id;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const alreadyLiked = blog.likedBy.includes(userId);

  if (alreadyLiked) {
    // 👎 UNLIKE
    blog.likedBy.pull(userId);
  } else {
    // 👍 LIKE
    blog.likedBy.push(userId);
  }

  blog.likesCount = blog.likedBy.length;
  // 📈 Recalculate trending
  blog.trendingScore = calculateTrendingScore(blog);
  await blog.save();

  res.status(200).json({
    success: true,
    action: alreadyLiked ? "unliked" : "liked",
    likesCount: blog.likesCount
  });
});

