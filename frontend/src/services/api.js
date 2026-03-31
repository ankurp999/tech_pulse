


import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.VITE_API_BASE_URL}`,
  withCredentials: true, // Include cookies in requests
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  // console.log(token);
  

  if (token) { 
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor for token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          `${process.env.VITE_API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Update localStorage with new token
        localStorage.setItem("accessToken", newAccessToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Or use navigate if in a component
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
