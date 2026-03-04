import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('VITE_API_BASE_URL is not defined in your environment variables.');
}

console.log(API_BASE_URL)

export const api = axios.create({
  //baseURL: '/api'
  baseURL: API_BASE_URL
})


api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token'); 
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});