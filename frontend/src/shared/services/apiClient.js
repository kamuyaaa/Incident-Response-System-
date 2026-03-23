const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = (configuredBaseUrl || "http://localhost:10000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const token = localStorage.getItem("auth_token");
    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        ...options,
        });
  const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }
      return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Unable to reach the API at ${API_BASE_URL}. Start the backend server or set VITE_API_BASE_URL.`);
    }

    throw error;
  }
}

const apiClient = {
  get(path) {
    return request(path, { method: "GET" });
  },
  post(path, body) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  patch(path, body) {
    return request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },
};

export default apiClient;