import apiClient from "../../../shared/services/apiClient";

const reporterService = {
  createIncident(payload) {
    return apiClient.post("/incidents", payload);
  },

  getMyReports(userId) {
    return apiClient.get(`/reporter/${userId}/reports`);
  },

  getAllIncidents() {
    return apiClient.get("/incidents");
  },
};

export default reporterService;