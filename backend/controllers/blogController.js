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
      content,
      category,
      tags,
      source,
      relatedProducts,
      hasBuyingLinks,
      images,
      status
    } = req.body;

    // Basic validation
    if (!title ||  !content || !category) {
      return res.status(400).json({
        message: "title, content and category are required"
      });
    }

    // Parse fields that come as JSON strings from FormData
    const parsedTags = tags ? JSON.parse(tags) : [];
    const parsedRelatedProducts = relatedProducts ? JSON.parse(relatedProducts) : [];
    const parsedImages = images ? JSON.parse(images) : [];

    // Images required for cover image (only for published blogs)
    if (status !== "draft" && parsedImages.length === 0) {
      return res.status(400).json({
        message: "At least one image is required"
      });
    }

    // Use first image from images array as cover image
    const coverImage = parsedImages.length > 0 ? parsedImages[0] : null;

    // Generate unique slug
    let slug = slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      category,
      tags: parsedTags,
      source,
      relatedProducts: parsedRelatedProducts,
      hasBuyingLinks: hasBuyingLinks === "true", // boolean from form
      coverImage,
      images: parsedImages,
      status,
      author: req.user._id  // 👈 set author from authenticated user
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
      .populate("author", "username email")
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
    .populate("relatedProducts", "name brand description images price currency buyingLinks rating")
    .populate({"path": "author", "select": "username email"});

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // 👁️ Track unique views by IP address
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  try {
    await BlogView.create({
      blog: blog._id,
      user: userId || null,
      ip
    });

    // Only increment if this is a new unique view (create succeeded)
    blog.viewsCount = (blog.viewsCount || 0) + 1;
  } catch (err) {
    // Duplicate view (same IP) → don't increment
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
/**
 * =========================
 * GET MY BLOGS (logged-in user)
 * =========================
 */
exports.getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id })
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, blogs });
});


/**
 * =========================
 * GET SINGLE BLOG BY ID (for editing)
 * =========================
 */
exports.getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id })
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .populate("relatedProducts");

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.status(200).json({ success: true, blog });
});


/**
 * =========================
 * UPDATE BLOG
 * =========================
 */
exports.updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const {
    title,
    content,
    category,
    tags,
    relatedProducts,
    hasBuyingLinks,
    images,
    status,
  } = req.body;

  const parsedTags = tags ? JSON.parse(tags) : blog.tags;
  const parsedRelatedProducts = relatedProducts ? JSON.parse(relatedProducts) : blog.relatedProducts;
  const parsedImages = images ? JSON.parse(images) : blog.images;

  if (status !== "draft" && parsedImages.length === 0) {
    res.status(400);
    throw new Error("At least one image is required for publishing");
  }

  const coverImage = parsedImages.length > 0 ? parsedImages[0] : blog.coverImage;

  // Update slug only if title changed
  let slug = blog.slug;
  if (title && title !== blog.title) {
    slug = slugify(title);
    const existing = await Blog.findOne({ slug, _id: { $ne: blog._id } });
    if (existing) slug = `${slug}-${Date.now()}`;
  }

  blog.title = title || blog.title;
  blog.slug = slug;
  blog.content = content || blog.content;
  blog.category = category || blog.category;
  blog.tags = parsedTags;
  blog.relatedProducts = parsedRelatedProducts;
  blog.hasBuyingLinks = hasBuyingLinks === "true";
  blog.coverImage = coverImage;
  blog.images = parsedImages;
  blog.status = status || blog.status;

  if (status === "published" && !blog.publishedAt) {
    blog.publishedAt = new Date();
  }

  await blog.save();

  res.status(200).json({ success: true, blog });
});


exports.getTrendingBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: "published" })
    .populate("author", "username email")
    .sort({ trendingScore: -1 })
    .limit(10);

  res.json({
    success: true,
    blogs
  });
});

