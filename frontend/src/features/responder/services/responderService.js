import apiClient from "../../../shared/services/apiClient";

const responderService = {
  getAssignments(userId) {
    return apiClient.get(`/responder/${userId}/assignments`);
  },

  updateIncidentStatus(incidentId, status) {
    return apiClient.patch(`/responder/incidents/${incidentId}/status`, {
      status,
    });
  },
};

export default responderService;