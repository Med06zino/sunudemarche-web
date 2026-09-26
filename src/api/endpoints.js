import client from "./client";

// --- Auth ---------------------------------------------------------------
export const register = (payload) => client.post("/auth/register/", payload);
export const login = (payload) => client.post("/auth/login/", payload);
export const logout = (refresh) => client.post("/auth/logout/", { refresh });

// --- Profil ---------------------------------------------------------------
export const getProfile = () => client.get("/profile/");
export const updateProfile = (payload) => client.patch("/profile/", payload);

// --- Services / Communes / Centres -----------------------------------------
export const listServices = () => client.get("/services/");
export const getService = (id) => client.get(`/services/${id}/`);
export const listCommunes = () => client.get("/communes/");
export const listCenters = (params) => client.get("/centers/", { params });

// --- Demandes (citoyen) -----------------------------------------------------
export const listRequests = () => client.get("/requests/");
export const getRequest = (id) => client.get(`/requests/${id}/`);
export const createRequest = (payload) => client.post("/requests/", payload);
export const updateRequest = (id, payload) => client.patch(`/requests/${id}/`, payload);
export const submitRequest = (id) => client.post(`/requests/${id}/submit/`);

// --- Documents ---------------------------------------------------------------
export const uploadDocument = (requestId, formData) =>
  client.post(`/requests/${requestId}/documents/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const downloadDocumentUrl = (id) =>
  `${client.defaults.baseURL}/documents/${id}/download/`;

// --- Notifications ---------------------------------------------------------------
export const listNotifications = () => client.get("/notifications/");
export const markNotificationRead = (id) => client.patch(`/notifications/${id}/read/`);

// --- Agent ---------------------------------------------------------------
export const listAgentRequests = (params) => client.get("/agent/requests/", { params });
export const getAgentRequest = (id) => client.get(`/agent/requests/${id}/`);
export const changeRequestStatus = (id, payload) =>
  client.patch(`/agent/requests/${id}/status/`, payload);

// --- Admin ---------------------------------------------------------------
export const getAdminStatistics = () => client.get("/admin/statistics/");
export const listAdminUsers = () => client.get("/admin/users/");
export const listAdminAgents = () => client.get("/admin/agents/");
export const listAdminAuditLogs = () => client.get("/admin/audit-logs/");
export const listAdminRequests = (params) => client.get("/admin/requests/", { params });
