import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs } from "../../services/blogApi";
import { getAllCategories } from "../../services/categoryApi";
import { ArrowRight } from "lucide-react";
import BlogCard from "../blog/BlogCard";

const CategorySection = ({ categorySlug }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        // 1️⃣ get categories
        const catRes = await getAllCategories();
        const category = catRes.data.find((c) => c.slug === categorySlug);

        if (!category) {
          setBlogs([]);
          setLoading(false);
          return;
        }

        setCategoryName(category.name);

        // 2️⃣ fetch blogs by categoryId
        const blogRes = await getAllBlogs({
          category: category._id,
        });

        setBlogs(blogRes.data.slice(0, 3)); // latest 3
        setLoading(false);
      } catch (err) {
        console.error("CATEGORY BLOG ERROR ❌", err);
        setLoading(false);
      }
    };

    fetchCategoryBlogs();
  }, [categorySlug]);

  if (loading) {
    return (
      <section className="my-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <section className="my-16 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {categoryName || categorySlug.toUpperCase()}
            </h2>
            <p className="text-gray-600">Latest articles in this category</p>
          </div>
          <Link
            to={`/category/${categorySlug}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-green-600 font-semibold hover:text-green-700 transition group"
          >
            View All
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="flex flex-col">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="animate-fadeInUp"
              style={{
                animation: "fadeInUp 0.6s ease-out forwards",
                opacity: 0,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default CategorySection;
