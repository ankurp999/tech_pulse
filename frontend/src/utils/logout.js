export const logout = (navigate) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  navigate("/");
};
