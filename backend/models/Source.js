const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    websiteUrl: {
      type: String,
      required: true
    },

    logo: {
      type: String // image url
    },

    type: {
      type: String,
      enum: ["official", "blog", "news", "review"],
      default: "blog"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Source", sourceSchema);
