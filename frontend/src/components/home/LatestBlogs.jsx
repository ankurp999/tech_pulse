import { useEffect, useState } from "react";
import { getAllBlogs } from "../../services/blogApi";
import { Newspaper } from "lucide-react";
import BlogCard from "../blog/BlogCard";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBlogs()
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("LATEST BLOGS ERROR ❌", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="my-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Newspaper className="text-blue-600" size={28} />
            <h2 className="text-3xl md:text-4xl font-bold">Latest Blogs</h2>
          </div>
          <p className="text-gray-600">Fresh content published recently</p>
        </div>

        <div className="flex flex-col">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="animate-fadeInUp"
              style={{
                animation: "fadeInUp 0.6s ease-out forwards",
                opacity: 0,
                animationDelay: `${index * 0.08}s`,
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

export default LatestBlogs;
