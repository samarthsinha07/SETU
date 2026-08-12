import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-handle 401 responses
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

/* ============ AUTH ============ */
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

/* ============ STUDENT ============ */
export const studentAPI = {
  getProfile: (userId) => api.get(`/student/profile/${userId}`),
  updateProfile: (userId, data) => api.put(`/student/profile/${userId}`, data),
};

/* ============ ALUMNI ============ */
export const alumniAPI = {
  getDirectory: (company) => api.get('/alumni/directory', { params: { company } }),
  getProfile: (userId) => api.get(`/alumni/profile/${userId}`),
  updateProfile: (userId, data) => api.put(`/alumni/profile/${userId}`, data),
};

/* ============ OPPORTUNITIES ============ */
export const opportunityAPI = {
  getAll: (params) => api.get('/opportunities', { params }),
  getById: (id, userId) => api.get(`/opportunities/${id}`, { params: { userId } }),
  create: (data, userId) => api.post(`/opportunities?userId=${userId}`, data),
  updateStatus: (id, status) => api.patch(`/opportunities/${id}/status?status=${status}`),
  toggleBookmark: (id, userId) => api.post(`/opportunities/${id}/bookmark?userId=${userId}`),
  getBookmarks: (userId) => api.get(`/opportunities/bookmarks/${userId}`),
};

/* ============ APPLICATIONS ============ */
export const applicationAPI = {
  getByStudent: (studentId) => api.get(`/applications/student/${studentId}`),
  getByOpportunity: (oppId) => api.get(`/applications/opportunity/${oppId}`),
  getById: (id) => api.get(`/applications/${id}`),
  apply: (studentId, opportunityId, resumeId, coverLetter) =>
    api.post(`/applications?studentId=${studentId}&opportunityId=${opportunityId}${resumeId ? '&resumeId=' + resumeId : ''}`, coverLetter || ''),
  updateStatus: (id, status, notes, adminId) =>
    api.patch(`/applications/${id}/status?status=${status}&adminOrRecruiterUserId=${adminId}${notes ? '&notes=' + encodeURIComponent(notes) : ''}`),
};

/* ============ REFERRALS ============ */
export const referralAPI = {
  getByStudent: (studentId) => api.get(`/referrals/student/${studentId}`),
  getByAlumni: (alumniId) => api.get(`/referrals/alumni/${alumniId}`),
  create: (studentId, alumniId, opportunityId, message) =>
    api.post(`/referrals?studentId=${studentId}&alumniId=${alumniId}${opportunityId ? '&opportunityId=' + opportunityId : ''}`, message),
  updateStatus: (id, status, feedbackNotes) =>
    api.patch(`/referrals/${id}/status?status=${status}${feedbackNotes ? '&feedbackNotes=' + encodeURIComponent(feedbackNotes) : ''}`),
};

/* ============ NOTIFICATIONS ============ */
export const notificationAPI = {
  get: (userId) => api.get(`/notifications/${userId}`),
  getUnreadCount: (userId) => api.get(`/notifications/${userId}/unread-count`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
};

/* ============ ANALYTICS ============ */
export const analyticsAPI = {
  getStudent: (studentId) => api.get(`/analytics/student/${studentId}`),
  getAdmin: () => api.get('/analytics/admin'),
};

/* ============ ADMIN ============ */
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (userId, status, adminId) => api.patch(`/admin/users/${userId}/status?status=${status}&adminId=${adminId}`),
  verifyCompany: (companyId, verified, adminId) => api.patch(`/admin/companies/${companyId}/verify?verified=${verified}&adminId=${adminId}`),
  getPendingOpportunities: () => api.get('/admin/opportunities/pending'),
  verifyOpportunity: (id, status) => api.patch(`/admin/opportunities/${id}/verify?status=${status}`),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

export default api;
