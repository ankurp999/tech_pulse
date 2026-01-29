const Blog = require("../models/Blog");
const slugify = require("../utils/slugify");
const { getTrendScore } = require("../utils/trendingHelper");
const Source = require("../models/Source");
const Product = require("../models/Product");
const asyncHandler = require("../middlewares/asyncHandler");
const BlogView = require("../models/BlogView");
const { calculateTrendingScore } = require("../utils/trendingHelper");


/**
 * =========================
 * CREATE BLOG
 * =========================
 */
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      category,
      tags,
      source,
      relatedProducts,
      hasBuyingLinks,
      coverImage,
      images,
      status
    } = req.body;

    if (!title || !summary || !content || !category) {
      return res.status(400).json({
        message: "title, summary, content and category are required"
      });
    }

    // slug generation
    let slug = slugify(title);

    // duplicate slug handling
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await Blog.create({
      title,
      slug,
      summary,
      content,
      category,
      tags,
      source,
      relatedProducts,
      hasBuyingLinks,
      coverImage,
      images,
      status
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * GET ALL PUBLISHED BLOGS
 * =========================
 */
exports.getAllBlogs = async (req, res) => {
  try {
    const query = { status: "published" };

    // 👇 category filter (slug)
    if (req.query.category) {
      query.category = req.query.category;
    }

    const blogs = await Blog.find(query)
      .populate("category")
      .sort({ publishedAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("BLOG FETCH ERROR ❌", error);
    res.status(500).json({ message: error.message });
  }
};


/**
 * =========================
 * GET SINGLE BLOG BY SLUG
 * (also increments views)
 * =========================
 */
// exports.getBlogBySlug = async (req, res) => {
//   try {
//     const blog = await Blog.findOne({
//       slug: req.params.slug,
//       status: "published"
//     })
//     .populate("category")
//       .populate("tags")
//       .populate("source")
//       .populate({
//         path: "relatedProducts",
//         model: "Product",           // 🔥 FORCE MODEL
//         select: "name price buyingLinks"
//       });
//     // .populate("category tags source relatedProducts");

//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     // increment views
//     blog.viewsCount += 1;
//     await blog.save();

//     res.status(200).json(blog);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user?._id; // optional (future)

  const blog = await Blog.findOne({
      slug,
      status: "published"
    })
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .populate("source", "name websiteUrl")
    .populate("relatedProducts", "name price buyingLinks");

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // 👁️ VIEW PER USER LOGIC
  if (userId) {
    try {
      await BlogView.create({
        blog: blog._id,
        user: userId
      });

      // only increment if first time
      blog.viewsCount += 1;
    } catch (err) {
      // duplicate view → ignore
    }
  }
  blog.trendingScore = calculateTrendingScore(blog);
  await blog.save();

  res.status(200).json({
    success: true,
    blog
  });
});

/**
 * =========================
 * GET TRENDING BLOGS
 * (LEVEL-2 LOGIC)
 * =========================
 */
exports.getTrendingBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: "published" })
    .sort({ trendingScore: -1 })
    .limit(10)
    .select(
      "title slug summary viewsCount likesCount trendingScore publishedAt"
    );

  res.json({
    success: true,
    blogs
  });
});

