import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-travel-backend-gjes.onrender.com/api",
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// Profile
export const getProfile = () => API.get("/profile");
export const updateProfile = (data) => API.put("/profile", data);

// Trips
export const editTrip = (id, data) => API.put(`/trips/${id}`, data);
export const archiveTrip = (id, archived) =>
  API.patch(`/trips/${id}/archive`, { archived });
export const manageCollaborators = (id, action, email) =>
  API.patch(`/trips/${id}/collaborators`, { action, email });

// Activities
export const updateActivity = (id, data) => API.put(`/activities/${id}`, data);
export const deleteActivity = (id) => API.delete(`/activities/${id}`);
export const moveActivity = (id, targetDayId) =>
  API.patch(`/activities/${id}/move`, { targetDayId });
export const reorderActivity = (id, order) =>
  API.patch(`/activities/${id}/reorder`, { order });

// Days
export const updateDay = (id, data) => API.put(`/days/${id}`, data);

// AI assistant
export const aiQuery = (payload) => API.post(`/ai/query`, payload);
// Images
export const imageSearch = (query) =>
  API.get(`/images/search?query=${encodeURIComponent(query)}`);
