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

export async function getRankings() {
  const { data } = await api.get('/ml/faculty-rankings');
  return data;
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

export async function getMyPerformance() {
  const { data } = await api.get('/faculty/my-performance');
  return data;
}

export default api;
