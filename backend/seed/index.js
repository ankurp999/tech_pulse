const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});


const connectDB = require("../config/db");

const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Source = require("../models/Source");
const Product = require("../models/Product");
const Blog = require("../models/Blog");

const seed = async () => {
  try {
    await connectDB();
    console.log("🌱 Seeding real-world demo data...");

    // CLEAN
    await Promise.all([
      Category.deleteMany(),
      Tag.deleteMany(),
      Source.deleteMany(),
      Product.deleteMany(),
      Blog.deleteMany()
    ]);

    // ======================
    // CATEGORIES
    // ======================
    const categories = await Category.insertMany([
      { name: "Smartphones", slug: "smartphones" },
      { name: "Automobiles", slug: "automobiles" },
      { name: "Robotics", slug: "robotics" },
      { name: "Appliances", slug: "appliances" }
    ]);

    // ======================
    // TAGS
    // ======================
    const tags = await Tag.insertMany([
      { name: "review", slug: "review" },
      { name: "camera", slug: "camera" },
      { name: "performance", slug: "performance" },
      { name: "battery", slug: "battery" },
      { name: "ai", slug: "ai" }
    ]);

    // ======================
    // SOURCES
    // ======================
    const sources = await Source.insertMany([
      {
        name: "TechPulse",
        slug: "techpulse",
        websiteUrl: "https://techpulse.com"
      },
      {
        name: "GSMArena",
        slug: "gsmarena",
        websiteUrl: "https://gsmarena.com"
      }
    ]);

    // ======================
    // PRODUCTS (REAL)
    // ======================
    const products = await Product.insertMany([
      {
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        brand: "Apple",
        category: categories[0]._id,
        price: 134900,
        buyingLinks: [
          {
            platform: "Amazon",
            url: "https://www.amazon.in/dp/B0CHX1W1XY",
            price: 134900
          },
          {
            platform: "Apple Store",
            url: "https://www.apple.com/in/iphone-15-pro/",
            price: 134900
          }
        ]
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        slug: "galaxy-s24-ultra",
        brand: "Samsung",
        category: categories[0]._id,
        price: 129999,
        buyingLinks: [
          {
            platform: "Flipkart",
            url: "https://www.flipkart.com/",
            price: 129999
          }
        ]
      },
      {
        name: "Tesla Model 3",
        slug: "tesla-model-3",
        brand: "Tesla",
        category: categories[1]._id,
        price: 4500000,
        buyingLinks: [
          {
            platform: "Tesla",
            url: "https://www.tesla.com/model3",
            price: 4500000
          }
        ]
      }
    ]);

    // ======================
    // BLOGS (REAL FEEL)
    // ======================
    const blogs = [];

    for (let i = 1; i <= 35; i++) {
      const cat = categories[i % categories.length];
      const src = sources[i % sources.length];
      const useProduct = i % 2 === 0;

      blogs.push({
        title: `Tech Insight ${i} – ${cat.name}`,
        slug: `tech-insight-${i}-${cat.slug}`,
        coverImage: `https://picsum.photos/900/450?random=${i}`,
        summary: `In-depth analysis of latest trends in ${cat.name}.`,
        content: `<p>This article explores how ${cat.name} technology is evolving in ${new Date().getFullYear()}.</p>`,
        category: cat._id,
        tags: [tags[i % tags.length]._id],
        source: src._id,
        relatedProducts: useProduct ? [products[i % products.length]._id] : [],
        hasBuyingLinks: useProduct,
        viewsCount: Math.floor(Math.random() * 5000),
        likesCount: Math.floor(Math.random() * 500),
        publishedAt: new Date(
          Date.now() - Math.random() * 10 * 86400000
        )
      });
    }

    await Blog.insertMany(blogs);

    console.log("✅ Real-world demo data seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seed failed", err);
    process.exit(1);
  }
};

seed();
