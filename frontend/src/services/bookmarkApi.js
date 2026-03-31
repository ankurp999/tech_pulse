import API from "./api";

export const toggleBookmark = (blogId) =>
  API.post(`/bookmarks/${blogId}`);

export const getSavedBlogs = () =>
  API.get("/bookmarks");

export const checkBookmark = (blogId) =>
  API.get(`/bookmarks/check/${blogId}`);
