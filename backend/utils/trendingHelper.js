exports.calculateTrendingScore = (blog) => {
  const viewsWeight = 5;
  const likesWeight = 2;
  const timeDecay = 0.3;

  const hoursSincePublished =
    (Date.now() - new Date(blog.publishedAt)) / (1000 * 60 * 60);

  const score =
    blog.viewsCount * viewsWeight +
    blog.likesCount * likesWeight -
    hoursSincePublished * timeDecay;

  return Math.max(Math.floor(score), 0);
};
