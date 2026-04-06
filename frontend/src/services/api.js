import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

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
  const { data } = await api.get('/faculty');
  return data;
}

export async function getFacultyById(id) {
  const { data } = await api.get(`/faculty/${id}`);
  return data;
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
  const { data } = await api.get(`/department/${departmentId}/faculty`);
  return data;
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
