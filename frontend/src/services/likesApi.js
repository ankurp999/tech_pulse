import API from "./api";

export const likeBlog = (blogId) =>
  API.post(`/blogs/${blogId}/like`);

export const unlikeBlog = (blogId) =>
  API.post(`/blogs/${blogId}/unlike`);
