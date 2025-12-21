import axios from 'axios';

// Default to localhost for running on web. If using Android emulator, change to 10.0.2.2:5000
const API_URL = 'http://localhost:5000';

const instance = axios.create({
  baseURL: API_URL + '/api',
  timeout: 5000,
});

export function setAuthToken(token) {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete instance.defaults.headers.common['Authorization'];
}

export default instance;
