import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

function unwrapResponse(payload, fallback = []) {
  if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }
  return payload ?? fallback;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginRequest(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function registerRequest(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function getAdminOverview() {
  const { data } = await api.get('/analytics/admin-overview');
  return data;
}

export async function getHodOverview() {
  const { data } = await api.get('/analytics/hod-overview');
  return data;
}

export async function getFacultyList() {
  const response = await api.get('/faculty');
  return unwrapResponse(response.data, []);
}

export async function createFaculty(payload) {
  const response = await api.post('/faculty', payload);
  return unwrapResponse(response.data, {});
}

export async function updateFaculty(id, payload) {
  const response = await api.put(`/faculty/${id}`, payload);
  return unwrapResponse(response.data, {});
}

export async function deleteFaculty(id) {
  const response = await api.delete(`/faculty/${id}`);
  return unwrapResponse(response.data, {});
}

export async function getFacultyById(id) {
  const response = await api.get(`/faculty/${id}`);
  return unwrapResponse(response.data, {});
}

export async function getDepartments() {
  const response = await api.get('/departments');
  return unwrapResponse(response.data, []);
}

export async function createDepartment(payload) {
  const response = await api.post('/departments', payload);
  return unwrapResponse(response.data, {});
}

export async function updateDepartment(id, payload) {
  const response = await api.put(`/departments/${id}`, payload);
  return unwrapResponse(response.data, {});
}

export async function deleteDepartment(id) {
  const response = await api.delete(`/departments/${id}`);
  return unwrapResponse(response.data, {});
}

export async function getUsers() {
  const response = await api.get('/users');
  return unwrapResponse(response.data, []);
}

export async function createUser(payload) {
  const response = await api.post('/users', payload);
  return unwrapResponse(response.data, {});
}

export async function updateUser(id, payload) {
  const response = await api.put(`/users/${id}`, payload);
  return unwrapResponse(response.data, {});
}

export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}`);
  return unwrapResponse(response.data, {});
}

export async function getRankingsPage(params = {}) {
  const { data } = await api.get('/ml/faculty-rankings', { params });

  if (Array.isArray(data)) {
    const pageSize = Number(params.pageSize || 10);
    return {
      items: data,
      pagination: {
        page: Number(params.page || 1),
        pageSize,
        total: data.length,
        totalPages: Math.max(1, Math.ceil(data.length / pageSize)),
      },
    };
  }

  return {
    items: data.items || [],
    pagination: data.pagination || {
      page: Number(params.page || 1),
      pageSize: Number(params.pageSize || 10),
      total: 0,
      totalPages: 1,
    },
  };
}

export async function getRankings(params = {}) {
  const result = await getRankingsPage(params);
  return result.items;
}

export async function getModelMetrics() {
  const { data } = await api.get('/ml/model-metrics');
  return data;
}

export async function submitFeedback(payload) {
  const { data } = await api.post('/feedback', payload);
  return data;
}

export async function getFeedback() {
  const { data } = await api.get('/feedback');
  return data;
}

export async function submitCourseFeedback(payload) {
  const { data } = await api.post('/course-feedback', payload);
  return data;
}

export async function getCourseFeedback() {
  const { data } = await api.get('/course-feedback');
  return data;
}

export async function getSubjects(params = {}) {
  const { data } = await api.get('/subjects', { params });
  return data;
}

export async function getDepartmentFaculty(departmentId) {
  const response = await api.get(`/faculty/department/${departmentId}`);
  return unwrapResponse(response.data, []);
}

export async function getDashboardAdmin() {
  const { data } = await api.get('/dashboard/admin');
  return data;
}

export async function getDashboardHod() {
  const { data } = await api.get('/dashboard/hod');
  return data;
}

export async function getDashboardFaculty() {
  const { data } = await api.get('/dashboard/faculty');
  return data;
}

export async function getDashboardStudent() {
  const { data } = await api.get('/dashboard/student');
  return data;
}

export async function getMyPerformance() {
  const { data } = await api.get('/faculty/my-performance');
  return data;
}

export async function getNotifications() {
  const { data } = await api.get('/notifications');
  return data;
}

export async function markNotificationsRead(notificationIds = []) {
  const { data } = await api.post('/notifications/read', { notificationIds });
  return data;
}

export async function getReports() {
  const { data } = await api.get('/reports');
  return data;
}

export async function generateReport(reportType, format = 'csv') {
  const { data } = await api.post('/reports/generate', { reportType, format });
  return data;
}

export async function downloadReport(reportId) {
  const response = await api.get(`/reports/${reportId}/download`, {
    responseType: 'blob',
  });

  return {
    blob: response.data,
    contentType: response.headers['content-type'] || 'application/octet-stream',
    contentDisposition: response.headers['content-disposition'] || '',
  };
}

export default api;
