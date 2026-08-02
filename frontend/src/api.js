import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (username, email, password) =>
    API.post('/users', { username, email, password }),
  login: (email, password) =>
    API.post('/users/login', { email, password }),
  getProfile: () =>
    API.get('/users/profile'),
  updateProfile: (data) =>
    API.put('/users/profile', data)
}

export const wasteLogAPI = {
  create: (category, weight, ecoScore) =>
    API.post('/waste-logs', { category, weight, ecoScore }),
  getAll: (page = 1, limit = 10) =>
    API.get('/waste-logs', { params: { page, limit } }),
  get: (id) =>
    API.get(`/waste-logs/${id}`),
  update: (id, data) =>
    API.put(`/waste-logs/${id}`, data),
  delete: (id) =>
    API.delete(`/waste-logs/${id}`)
}

export const communityAPI = {
  create: (name, description, location) =>
    API.post('/communities', { name, description, location }),
  getAll: (page = 1, limit = 10, search = '', location = '') =>
    API.get('/communities', { params: { page, limit, search, location } }),
  get: (id) =>
    API.get(`/communities/${id}`),
  update: (id, data) =>
    API.put(`/communities/${id}`, data),
  delete: (id) =>
    API.delete(`/communities/${id}`),
  join: (id) =>
    API.post(`/communities/${id}/join`),
  leave: (id) =>
    API.post(`/communities/${id}/leave`)
}

export const businessAPI = {
  create: (name, category, city, description) =>
    API.post('/businesses', { name, category, city, description }),
  getAll: (page = 1, limit = 10, search = '', category = '') =>
    API.get('/businesses', { params: { page, limit, search, category } }),
  get: (id) =>
    API.get(`/businesses/${id}`),
  update: (id, data) =>
    API.put(`/businesses/${id}`, data),
  delete: (id) =>
    API.delete(`/businesses/${id}`),
  review: (id, rating, comment) =>
    API.post(`/businesses/${id}/reviews`, { rating, comment })
}

export const challengeAPI = {
  create: (title, description, category, difficulty, targetPoints) =>
    API.post('/challenges', { title, description, category, difficulty, targetPoints }),
  getAll: (page = 1, limit = 10, category = '', difficulty = '') =>
    API.get('/challenges', { params: { page, limit, category, difficulty } }),
  get: (id) =>
    API.get(`/challenges/${id}`),
  update: (id, data) =>
    API.put(`/challenges/${id}`, data),
  delete: (id) =>
    API.delete(`/challenges/${id}`),
  participate: (id) =>
    API.post(`/challenges/${id}/participate`)
}

export const statsAPI = {
  getLeaderboard: (page = 1, limit = 10) =>
    API.get('/stats/leaderboard', { params: { page, limit } }),
  getUserStats: (id) =>
    API.get(`/stats/users/${id}`),
  getChallengeStats: () =>
    API.get('/stats/challenges'),
  getWasteStats: () =>
    API.get('/stats/waste')
}

export default API
