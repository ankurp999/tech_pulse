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
      required: true
    }
  },
  { timestamps: true }
);

// 🔒 Prevent duplicate views by same user
blogViewSchema.index({ blog: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("BlogView", blogViewSchema);
