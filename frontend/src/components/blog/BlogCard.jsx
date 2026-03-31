import { Link } from "react-router-dom";
import { MessageCircle, Heart } from "lucide-react";

const BlogCard = ({ blog }) => {
  if (!blog) return null;

  // Debug log to check author data
  // console.log("BlogCard blog author:", blog.author);

  // Format date like "Feb 13" or "1d ago"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1d ago";
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const authorName = blog.author?.username || "Anonymous";

  return (
    <Link to={`/blog/${blog.slug}`} className="block group">
      <article className="flex items-start justify-between gap-6 py-6 border-b border-gray-100 bg-white">
        {/* Left side - Content */}
        <div className="flex-1 min-w-0">
          {/* Author info */}
          <div className="flex items-center gap-2 mb-2">
            {blog.author?.avatar ? (
              <img
                src={blog.author.avatar}
                alt={authorName}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xs font-bold text-white">
                {authorName?.charAt(0).toUpperCase() || "A"}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-900">
              {authorName}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>

          {/* Summary/Description */}
          <p className="text-gray-500 text-base mb-3 line-clamp-2 hidden sm:block">
            {blog.summary || blog.content?.replace(/<[^>]*>/g, "").substring(0, 150)}
          </p>

          {/* Meta info - date, claps, comments */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {blog.likesCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {blog.commentsCount || 0}
            </span>
          </div>
        </div>

        {/* Right side - Cover Image */}
        <div className="flex-shrink-0">
          <div className="w-28 h-28 sm:w-40 sm:h-32 overflow-hidden rounded">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
