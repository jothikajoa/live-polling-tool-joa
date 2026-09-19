import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Poll API
export const pollAPI = {
  createPoll: (data) => api.post('/polls', data),
  getAllPolls: () => api.get('/polls'),
  getUserPolls: () => api.get('/polls/user/my-polls'),
  getPollById: (id) => api.get(`/polls/${id}`),
  deletePoll: (id) => api.delete(`/polls/${id}`),
  vote: (pollId, optionIndex) => api.post(`/polls/${pollId}/vote`, { optionIndex }),
  getPollResults: (id) => api.get(`/polls/${id}/results`),
};

export default api;
