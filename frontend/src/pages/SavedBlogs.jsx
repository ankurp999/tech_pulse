import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedBlogs } from "../services/bookmarkApi";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  Bookmark,
  Eye,
  Heart,
  Calendar,
  Tag,
  ArrowRight,
  FileText,
} from "lucide-react";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const SavedBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/saved" } });
      return;
    }
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const res = await getSavedBlogs();
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Failed to fetch saved blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-[500px] overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-40 right-0 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        {/* Header */}
        <div className="relative max-w-4xl mx-auto px-4 pt-28 pb-6">
          <div className="flex items-end justify-between gap-4 animate-fadeInUp">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-200/50">
                  <Bookmark size={18} className="text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Saved Blogs
                </h1>
              </div>
              <p className="text-gray-500 text-sm ml-[52px]">
                {blogs.length} {blogs.length === 1 ? "blog" : "blogs"} bookmarked
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 pb-20">
          {loading ? (
            <div className="space-y-4 mt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-32 h-24 bg-gray-100 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-3/4 bg-gray-100 rounded-lg" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded-lg" />
                      <div className="flex gap-3">
                        <div className="h-3 w-16 bg-gray-100 rounded-full" />
                        <div className="h-3 w-20 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div
              className="text-center py-20 animate-fadeInUp"
              style={{ animationDelay: "200ms" }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Bookmark size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No saved blogs yet
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                Bookmark blogs while reading to save them here.
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold shadow-md shadow-amber-200/50 hover:shadow-lg transition-all"
              >
                Explore Blogs
              </button>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {blogs.map((blog, idx) => (
                <div
                  key={blog._id}
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  className="group cursor-pointer bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:shadow-amber-100/20 transition-all duration-300 animate-fadeInUp"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumbnail */}
                    <div className="sm:w-44 flex-shrink-0">
                      {blog.coverImage || (blog.images && blog.images[0]) ? (
                        <div className="relative h-40 sm:h-full overflow-hidden bg-gray-50">
                          <img
                            src={blog.coverImage || blog.images[0]}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="h-40 sm:h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center min-h-[120px]">
                          <FileText size={28} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-5 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
                          {blog.title}
                        </h3>
                        <Bookmark
                          size={16}
                          className="flex-shrink-0 text-amber-500"
                          fill="currentColor"
                        />
                      </div>

                      {/* Author */}
                      {blog.author && (
                        <p className="text-xs text-gray-500 mb-1.5">
                          by{" "}
                          <span className="font-medium text-gray-700">
                            {blog.author.username}
                          </span>
                        </p>
                      )}

                      {/* Category */}
                      {blog.category && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <Tag size={12} className="text-gray-400" />
                          <span className="text-xs font-medium text-gray-500">
                            {blog.category.name || blog.category}
                          </span>
                        </div>
                      )}

                      {/* Stats row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          {blog.viewsCount || 0} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={12} />
                          {blog.likesCount || 0} likes
                        </div>

                        <span className="ml-auto inline-flex items-center gap-1 text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Read <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SavedBlogs;
