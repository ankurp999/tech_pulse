import API from "./api";

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return API.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};