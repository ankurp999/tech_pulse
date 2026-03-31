const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      // HTML / Markdown
    },

    coverImage: {
      type: String,
    },

    images: [
      {
        type: String,
      },
    ],

    // 🔗 CATEGORY (Main topic)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // 🔗 TAGS (extra filters / SEO)
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    // 🔗 SOURCE (content attribution)
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Source",
    },

    // 🔗 PRODUCTS (only for product based blogs)
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    hasBuyingLinks: {
      type: Boolean,
      default: false,
    },

    // 🟡 Manual override only
    isTrending: {
      type: Boolean,
      default: false,
    },

    // 🔥 Trending logic fields
    viewsCount: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
    },
    trendingScore: {
      type: Number,
      default: 0,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
