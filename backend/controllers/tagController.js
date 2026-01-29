const Tag = require("../models/Tag");
const slugify = require("../utils/slugify");

// ✅ Create Tag (admin / internal use)
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const slug = slugify(name);

    const existingTag = await Tag.findOne({ slug });
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const tag = await Tag.create({
      name,
      slug
    });

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all active tags (frontend use)
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single tag by slug
exports.getTagBySlug = async (req, res) => {
  try {
    const tag = await Tag.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
