const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")   // spaces & special chars → -
    .replace(/^-+|-+$/g, "");   // starting/ending - remove
};

module.exports = slugify;
