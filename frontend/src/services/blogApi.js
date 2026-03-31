// import API from "./api";

// // 🔓 Public
// export const getAllBlogs = (params = {}) =>
//   API.get("/blogs", { params });

// export const getTrendingBlogs = () => API.get("/blogs/trending");

// export const getBlogBySlug = (slug) => API.get(`/blogs/${slug}`);

// // 🔒 Protected (Admin / Auth required)
// export const createBlog = (formData) =>
//   API.post("/blogs", formData, {
//     headers: { "Content-Type": "multipart/form-data" }
//   });
 
import API from "./api";

/* ========================
   PUBLIC ROUTES
======================== */

export const getAllBlogs = (params = {}) =>
  API.get("/blogs", { params });

export const getTrendingBlogs = () =>
  API.get("/blogs/trending");

export const getBlogBySlug = (slug) =>
  API.get(`/blogs/${slug}`);


/* ========================
   PROTECTED ROUTES
======================== */

export const getMyBlogs = () =>
  API.get("/blogs/my");

export const getBlogById = (id) =>
  API.get(`/blogs/edit/${id}`);

export const updateBlog = (id, formData) =>
  API.put(`/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const createBlog = (formData) => {
  return API.post("/blogs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}