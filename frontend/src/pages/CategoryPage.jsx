import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BlogCard from "../components/blog/BlogCard";

import { getAllCategories } from "../services/categoryApi";
import { getAllBlogs } from "../services/blogApi";

const CategoryPage = () => {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        // 1️⃣ get category by slug
        const catRes = await getAllCategories();
        const found = catRes.data.find((c) => c.slug === slug);

        if (!found) {
          setLoading(false);
          return;
        }

        setCategory(found);

        // 2️⃣ get blogs of this category
        const blogRes = await getAllBlogs({
          category: found._id
        });

        setBlogs(blogRes.data);
        setLoading(false);
      } catch (error) {
        console.error("CATEGORY PAGE ERROR ❌", error);
        setLoading(false);
      }
    };

    fetchCategoryBlogs();
  }, [slug]);

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading category...</p>;
  }

  if (!category) {
    return <p style={{ padding: "1rem" }}>Category not found</p>;
  }

  return (
    <>
      <Navbar />

      <main className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            {category.name}
          </h1>

          {blogs.length === 0 ? (
            <p className="text-gray-500">No blogs found in this category</p>
          ) : (
            <div className="flex flex-col">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CategoryPage;
