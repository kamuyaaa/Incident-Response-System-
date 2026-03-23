import apiClient from "../../../shared/services/apiClient";

const accountService = {
  async getProfile(userId) {
    return apiClient.get(`/account/profile/${userId}`);
  },

  async updateProfile(userId, profileData) {
    return apiClient.patch(`/account/profile/${userId}`, profileData);
  },
};

export default accountService;