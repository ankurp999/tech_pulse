const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    brand: {
      type: String,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    description: {
      type: String
    },

    images: [
      {
        type: String
      }
    ],

    price: {
      type: Number
    },

    currency: {
      type: String,
      default: "INR"
    },

    buyingLinks: [
      {
        platform: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        },
        price: {
          type: Number
        },
        affiliateTag: {
          type: String
        },
        isActive: {
          type: Boolean,
          default: true
        }
      }
    ],

    rating: {
      type: Number,
      min: 0,
      max: 5
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

module.exports = mongoose.model("Product", productSchema);
