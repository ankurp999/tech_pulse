import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogBySlug } from "../services/blogApi";
import { likeBlog } from "../services/likesApi";
import { toggleBookmark, checkBookmark } from "../services/bookmarkApi";
import BuySection from "../components/blog/BuySection";
import {
  Heart,
  Eye,
  Calendar,
  User,
  Clock,
  Share2,
  Bookmark,
  ArrowUp,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* ── helpers ──────────────────────────────── */
const readTime = (text) => {
  if (!text) return "1 min";
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* ────────────────────────────────────────── */
const BlogDetail = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    window.scrollTo(0, 0);
    getBlogBySlug(slug)
      .then((res) => {
        setBlog(res.data.blog);
        setLikes(res.data.blog.likesCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("BLOG DETAIL ERROR", err);
        setLoading(false);
      });
  }, [slug]);

  /* scroll-to-top visibility */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLike = async () => {
    if (!blog || liking) return;
    try {
      setLiking(true);
      const res = await likeBlog(blog._id);
      setLikes(res.data.likesCount);
      setLiked(true);
    } catch (error) {
      console.error("LIKE ERROR", error);
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  /* Check bookmark status */
  useEffect(() => {
    if (!blog || !token) return;
    checkBookmark(blog._id)
      .then((res) => setBookmarked(res.data.saved))
      .catch(() => {});
  }, [blog, token]);

  const handleBookmark = async () => {
    if (!token) return;
    try {
      const res = await toggleBookmark(blog._id);
      setBookmarked(res.data.saved);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  /* ── loading skeleton ────────────────── */
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-3xl mx-auto px-4 pt-28">
            <div className="animate-pulse space-y-6">
              <div className="h-4 w-24 bg-gray-200 rounded-full" />
              <div className="h-10 w-3/4 bg-gray-200 rounded-xl" />
              <div className="h-10 w-1/2 bg-gray-200 rounded-xl" />
              <div className="flex gap-4 mt-6">
                <div className="h-8 w-20 bg-gray-200 rounded-full" />
                <div className="h-8 w-28 bg-gray-200 rounded-full" />
                <div className="h-8 w-24 bg-gray-200 rounded-full" />
              </div>
              <div className="h-px bg-gray-200 mt-6" />
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded"
                  style={{ width: `${85 - i * 8}%` }}
                />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center animate-fadeInUp">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Blog not found
            </h2>
            <p className="text-gray-500">
              The blog you're looking for doesn't exist or was removed.
            </p>
          </div>
        </main>
      </>
    );
  }

  const authorInitial = (blog.author?.username || "A")[0].toUpperCase();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Floating decorative orbs */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-[600px] overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-100/40 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-20 right-0 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* ── HERO HEADER ───────────────────── */}
        <header className="relative max-w-3xl mx-auto px-4 pt-28 pb-8">
          {/* Category badge */}
          {blog.category && (
            <span
              className="inline-block text-xs font-semibold tracking-wider uppercase text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full mb-5 animate-fadeInUp"
            >
              {blog.category.name || blog.category}
            </span>
          )}

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6 animate-fadeInUp"
            style={{ animationDelay: "80ms" }}
          >
            {blog.title}
          </h1>

          {/* Author + meta row */}
          <div
            className="flex flex-wrap items-center gap-5 text-sm text-gray-500 animate-fadeInUp"
            style={{ animationDelay: "160ms" }}
          >
            {/* Author pill */}
            {blog.author && (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-green-200">
                  {authorInitial}
                </div>
                <span className="font-medium text-gray-800">
                  {blog.author.username || "Anonymous"}
                </span>
              </div>
            )}

            <span className="hidden sm:block w-px h-5 bg-gray-200" />

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(blog.publishedAt)}
            </div>

            {/* Read time */}
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              {readTime(blog.content)}
            </div>
          </div>

          {/* Interaction bar */}
          <div
            className="flex items-center gap-3 mt-8 pb-8 border-b border-gray-200 animate-fadeInUp"
            style={{ animationDelay: "240ms" }}
          >
            {/* Views */}
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Eye size={16} />
              <span>{blog.viewsCount || 0}</span>
            </div>

            {/* Like button */}
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                ${
                  liked
                    ? "bg-red-100 text-red-600 scale-105"
                    : liking
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                }`}
            >
              <Heart
                size={16}
                className={`transition-transform duration-300 ${liked ? "scale-125" : ""}`}
                fill={liked ? "currentColor" : "none"}
              />
              {likes}
            </button>

            <div className="flex-1" />

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-500 hover:bg-gray-100 transition"
            >
              <Share2 size={15} />
              {copied ? "Copied!" : "Share"}
            </button>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                bookmarked
                  ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
              title={bookmarked ? "Remove bookmark" : "Bookmark this blog"}
            >
              <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </header>

        {/* ── CONTENT ───────────────────────── */}
        <article
          className="max-w-3xl mx-auto px-4 pb-16 animate-fadeInUp"
          style={{ animationDelay: "320ms" }}
        >
          {(() => {
            // Show all images in their original positions
            const displayImages = blog.images || [];
            const contentLines = blog.content.split("\n").filter((l) => l.trim());

            return (
              <div className="prose prose-lg max-w-none prose-gray prose-headings:font-bold prose-a:text-green-600 prose-img:rounded-2xl">
                {contentLines.map((line, index) => (
                  <div key={index} className="mb-7">
                    <p className="text-lg leading-[1.85] text-gray-700 font-[410]">
                      {line}
                    </p>

                    {displayImages[index] && (
                      <div className="mt-5 mb-7 group">
                        <div className="relative rounded-2xl overflow-hidden shadow-md shadow-gray-200/50">
                          <img
                            src={displayImages[index]}
                            alt={`content-${index}`}
                            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Remaining images beyond content lines */}
                {displayImages.slice(contentLines.length).map((img, idx) => (
                  <div key={`img-${idx}`} className="mb-7 group">
                    <div className="relative rounded-2xl overflow-hidden shadow-md shadow-gray-200/50">
                      <img
                        src={img}
                        alt={`additional-${idx}`}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </article>

        {/* ── TAGS ──────────────────────────── */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 pb-10 animate-fadeInUp">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-medium text-gray-500 bg-gray-100 hover:bg-green-50 hover:text-green-600 px-3 py-1.5 rounded-full transition cursor-default"
                >
                  #{typeof tag === "string" ? tag : tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── AUTHOR CARD ───────────────────── */}
        {blog.author && (
          <div className="max-w-3xl mx-auto px-4 py-10 animate-fadeInUp">
            <div className="relative bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-green-200/50">
                  {authorInitial}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                    Written by
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {blog.author.username || "Anonymous"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Published on {formatDate(blog.publishedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BUY SECTION ───────────────────── */}
        {blog.hasBuyingLinks && blog.relatedProducts && (
          <section className="max-w-3xl mx-auto px-4 pb-20 animate-fadeInUp">
            <BuySection products={blog.relatedProducts} />
          </section>
        )}

        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-300/40 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            showTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <ArrowUp size={18} />
        </button>
      </main>

      <Footer />
    </>
  );
};

export default BlogDetail;
