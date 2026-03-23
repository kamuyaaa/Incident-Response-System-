import apiClient from "../../../shared/services/apiClient";

const adminService = {
  getIncidentsQueue(params = "") {
    return apiClient.get(`/admin/incidents/queue${params}`);
  },

  getResponders() {
    return apiClient.get("/admin/responders");
  },

  assignResponder(incidentId, responderId) {
    return apiClient.patch(`/admin/incidents/${incidentId}/assign`, {
      responderId,
    });
  },
};

export default adminService;