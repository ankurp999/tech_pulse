const Product = require("../models/Product");
const slugify = require("../utils/slugify");

/**
 * =========================
 * CREATE PRODUCT
 * =========================
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      images,
      price,
      currency,
      buyingLinks,
      rating
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: "Product name and category are required"
      });
    }

    let slug = slugify(name);

    const exists = await Product.findOne({ slug });
    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await Product.create({
      name,
      slug,
      brand,
      category,
      description,
      images,
      price,
      currency,
      buyingLinks,
      rating
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * GET ALL PRODUCTS
 * =========================
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * GET SINGLE PRODUCT BY SLUG
 * =========================
 */
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true
    })
    .populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
