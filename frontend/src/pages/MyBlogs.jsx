import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBlogs } from "../services/blogApi";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  BookOpen,
  Eye,
  Heart,
  Calendar,
  Tag,
  PenLine,
  ArrowRight,
  FileText,
  Clock,
} from "lucide-react";

const statusColors = {
  published: "bg-green-50 text-green-700 border-green-100",
  draft: "bg-amber-50 text-amber-700 border-amber-100",
  archived: "bg-gray-100 text-gray-500 border-gray-200",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const MyBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/my-blogs" } });
      return;
    }
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getMyBlogs();
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === "all" ? blogs : blogs.filter((b) => b.status === filter);

  const counts = {
    all: blogs.length,
    published: blogs.filter((b) => b.status === "published").length,
    draft: blogs.filter((b) => b.status === "draft").length,
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-[500px] overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-100/40 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-40 -left-20 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        {/* Header */}
        <div className="relative max-w-4xl mx-auto px-4 pt-28 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fadeInUp">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200/50">
                  <BookOpen size={18} className="text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  My Blogs
                </h1>
              </div>
              <p className="text-gray-500 text-sm ml-[52px]">
                {blogs.length} {blogs.length === 1 ? "story" : "stories"} written
              </p>
            </div>

            <button
              onClick={() => navigate("/create")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold shadow-md shadow-green-200/50 hover:shadow-lg hover:shadow-green-300/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <PenLine size={16} />
              Write New
            </button>
          </div>

          {/* Filter tabs */}
          <div
            className="flex gap-2 mt-8 animate-fadeInUp"
            style={{ animationDelay: "100ms" }}
          >
            {["all", "published", "draft"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === tab
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span
                  className={`ml-1.5 text-xs ${
                    filter === tab ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 pb-20">
          {loading ? (
            /* Skeleton */
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
          ) : filtered.length === 0 ? (
            /* Empty state */
            <div
              className="text-center py-20 animate-fadeInUp"
              style={{ animationDelay: "200ms" }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <FileText size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {filter === "all"
                  ? "No stories yet"
                  : `No ${filter} stories`}
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                {filter === "all"
                  ? "Start writing your first blog post!"
                  : "Try changing the filter above."}
              </p>
              {filter === "all" && (
                <button
                  onClick={() => navigate("/create")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold shadow-md shadow-green-200/50 hover:shadow-lg transition-all"
                >
                  <PenLine size={16} />
                  Write Your First Blog
                </button>
              )}
            </div>
          ) : (
            /* Blog cards */
            <div className="space-y-4 mt-4">
              {filtered.map((blog, idx) => (
                <div
                  key={blog._id}
                  onClick={() =>
                    blog.status === "published"
                      ? navigate(`/blog/${blog.slug}`)
                      : blog.status === "draft"
                      ? navigate(`/create?edit=${blog._id}`)
                      : null
                  }
                  className={`group bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:shadow-green-100/20 transition-all duration-300 animate-fadeInUp ${
                    blog.status === "published" || blog.status === "draft"
                      ? "cursor-pointer"
                      : "cursor-default"
                  }`}
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
                        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-green-700 transition-colors">
                          {blog.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            statusColors[blog.status] || statusColors.draft
                          }`}
                        >
                          {blog.status}
                        </span>
                      </div>

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

                        {blog.status === "published" && (
                          <span className="ml-auto inline-flex items-center gap-1 text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Read <ArrowRight size={12} />
                          </span>
                        )}
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

export default MyBlogs;
