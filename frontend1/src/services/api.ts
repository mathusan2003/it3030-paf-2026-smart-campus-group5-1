import axios from 'axios';

const OAUTH_TOKEN_STORAGE_KEY = 'smart-campus-oauth-access-token';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(OAUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const getBookings = async (params?: Record<string, unknown>) =>
  (await api.get('/bookings', { params })).data;

export const createBooking = async (payload: unknown) =>
  (await api.post('/bookings', payload)).data;

export const approveBooking = async (id: string) =>
  (await api.patch(`/bookings/${id}/approve`)).data;

export const cancelBooking = async (id: string) =>
  (await api.patch(`/bookings/${id}/cancel`)).data;

export const requestBookingCancellation = async (id: string, reason: string) =>
  (await api.patch(`/bookings/${id}/cancel-request`, { reason })).data;

export const rejectBooking = async (id: string, reason = 'Rejected by admin') =>
  (await api.patch(`/bookings/${id}/reject`, { reason })).data;

export const getResources = async (params?: Record<string, unknown>) =>
  (await api.get('/resources', { params })).data;

export const createResource = async (payload: unknown) =>
  (await api.post('/resources', payload)).data;

export const getTickets = async (params?: Record<string, unknown>) =>
  (await api.get('/tickets', { params })).data;

export const createTicket = async (payload: unknown) =>
  (await api.post('/tickets', payload)).data;

export const updateTicketStatus = async (id: string, payload: unknown) =>
  (await api.patch(`/tickets/${id}/status`, payload)).data;

export const assignTicket = async (id: string, technicianUserId: string) =>
  (await api.patch(`/tickets/${id}/assign`, { technicianUserId })).data;

export const getTechnicians = async () =>
  (await api.get('/users/technicians')).data;

export const getNotifications = async (userId: string) =>
  (await api.get('/notifications', { params: { userId } })).data;

export const markNotificationRead = async (id: string) =>
  (await api.patch(`/notifications/${id}/read`)).data;
