const mongoose = require("mongoose");

const blogViewSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    ip: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// 🔒 Prevent duplicate views by same IP on same blog
blogViewSchema.index({ blog: 1, ip: 1 }, { unique: true });

module.exports = mongoose.model("BlogView", blogViewSchema);
