import apiClient from "../../../shared/services/apiClient";

const authService = {
  register(payload) {
    return apiClient.post("/auth/register", payload);
  },

  login(payload) {
    return apiClient.post("/auth/login", payload);
  },
  
  forgotPassword(payload) {
    return apiClient.post("/auth/forgot-password", payload);
  },
};

export default authService;