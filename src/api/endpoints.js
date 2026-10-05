import client from "./client";

// Auth 
export const register = (payload) => client.post("/auth/register/", payload);
export const login    = (payload) => client.post("/auth/login/",    payload);
export const logout   = (refresh)  => client.post("/auth/logout/", { refresh });

// Activation de compte par email
export const activateAccount    = (token) => client.get(`/auth/activate/${token}/`);
export const resendActivation   = (email) => client.post("/auth/resend-activation/", { email });

//  Profil 
export const getProfile = () => client.get("/profile/");
export const updateProfile = (payload) => client.patch("/profile/", payload);

//  Services / Communes / Centres 
// Ces routes sont publiques (AllowAny). On retire explicitement le header
// Authorization pour éviter qu'un token expiré déclenche un 401 de SimpleJWT.
const _noAuth = { headers: { Authorization: undefined } };

export const listServices = () => client.get("/services/", _noAuth);
export const getService = (id) => client.get(`/services/${id}/`, _noAuth);
export const listCommunes = () => client.get("/communes/", _noAuth);
export const listCenters = (params) => client.get("/centers/", { ..._noAuth, params });

//  Demandes (citoyen) 
export const listRequests = () => client.get("/requests/");
export const getRequest = (id) => client.get(`/requests/${id}/`);
export const createRequest = (payload) => client.post("/requests/", payload);
export const updateRequest = (id, payload) => client.patch(`/requests/${id}/`, payload);
export const submitRequest = (id) => client.post(`/requests/${id}/submit/`);

// Documents 
export const uploadDocument = (requestId, formData) =>
  client.post(`/requests/${requestId}/documents/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Upload du document officiel par un agent.
 * POST /api/v1/agent/requests/{requestId}/official-document/
 */
export const uploadOfficialDocument = (requestId, formData) =>
  client.post(`/agent/requests/${requestId}/official-document/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Retourne l'URL de téléchargement/aperçu d'un document.
 * À utiliser avec window.open() ou comme href — nécessite le token Bearer
 * injecté via l'intercepteur Axios (appeler downloadDocument() à la place
 * pour une ouverture propre dans un nouvel onglet).
 */
export const getDocumentDownloadUrl = (id) =>
  `${client.defaults.baseURL}/documents/${id}/download/`;

/**
 * Télécharge (ou ouvre) un document via Axios pour hériter du token Bearer.
 * Retourne un Blob URL utilisable avec window.open() ou <a href>.
 */
export const downloadDocument = (id) =>
  client.get(`/documents/${id}/download/`, { responseType: "blob" });

//  Notifications 
export const listNotifications = () => client.get("/notifications/");
export const markNotificationRead = (id) => client.patch(`/notifications/${id}/read/`);

/**
 * GET /api/v1/notifications/channels/
 * Retourne [{value, label}] des canaux disponibles.
 */
export const listNotificationChannels = () => client.get("/notifications/channels/");

//  Agent 
export const listAgentRequests = (params) => client.get("/agent/requests/", { params });
export const getAgentRequest = (id) => client.get(`/agent/requests/${id}/`);
export const changeRequestStatus = (id, payload) =>
  client.patch(`/agent/requests/${id}/status/`, payload);

/**
 * Génère automatiquement le PDF extrait de naissance, l'attache comme
 * document officiel et passe la demande en DOCUMENT_DISPONIBLE.
 * POST /api/agent/requests/{id}/generate-extract/
 */
export const generateExtract = (requestId) =>
  client.post(`/agent/requests/${requestId}/generate-extract/`);

/**
 * Retourne un aperçu PDF (blob) sans sauvegarder en base.
 * GET /api/agent/requests/{id}/preview-extract/
 */
export const previewExtract = (requestId) =>
  client.get(`/agent/requests/${requestId}/preview-extract/`, {
    responseType: "blob",
  });

// Admin 
export const getAdminStatistics = () => client.get("/admin/statistics/");
export const listAdminUsers = () => client.get("/admin/users/");
export const listAdminAgents = () => client.get("/admin/agents/");
export const listAdminAuditLogs = () => client.get("/admin/audit-logs/");
export const listAdminRequests = (params) => client.get("/admin/requests/", { params });
