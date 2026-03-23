import apiClient from "../../../shared/services/apiClient";

const authService = {
  register(payload) {
    return apiClient.post("/auth/register", payload);
  },

  login(payload) {
    return apiClient.post("/auth/login", payload);
  },
};

export default authService;