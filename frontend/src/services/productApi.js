import API from "./api";

// 🔓 Public
export const getAllProducts = () => API.get("/products");
export const getProductBySlug = (slug) => API.get(`/products/${slug}`);

// 🔒 Protected
export const createProduct = (data) => API.post("/products", data);
