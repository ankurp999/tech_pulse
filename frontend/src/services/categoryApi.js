import API from "./api";

export const getAllCategories = () => API.get("/categories");
