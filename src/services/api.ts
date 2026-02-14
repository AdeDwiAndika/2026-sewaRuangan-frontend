import axios from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User 
} from '../types/user';

// Base URL API backend
const API_BASE_URL = 'http://localhost:5238/api';

// Buat axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true // Penting untuk CORS
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url, config.data); // Debug
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk response
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data); // Debug
    return response;
  },
  (error) => {
    console.error('Error response:', error.response?.data); // Debug
    console.error('Error status:', error.response?.status); // Debug
    console.error('Error headers:', error.response?.headers); // Debug
    return Promise.reject(error);
  }
);

// Service untuk authentication
export const authService = {
  // Register user baru
    async register(data: RegisterRequest): Promise<User> {
    try {
      console.log('📤 Register request to:', `${API_BASE_URL}/User/register`);
      console.log('📦 Register data:', JSON.stringify(data, null, 2));
      
      const response = await api.post('/User/register', data);
      
      console.log('📥 Register response status:', response.status);
      console.log('📥 Register response data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Register error - FULL OBJECT:', error);
      
      if (error.response) {
        // Server merespon dengan error status code (4xx, 5xx)
        console.error('❌ Error response status:', error.response.status);
        console.error('❌ Error response data:', error.response.data);
        console.error('❌ Error response headers:', error.response.headers);
        
        const message = error.response.data?.message 
          || JSON.stringify(error.response.data) 
          || `Error ${error.response.status}`;
        
        throw new Error(message);
      } else if (error.request) {
        // Request dibuat tapi tidak ada response
        console.error('❌ No response received:', error.request);
        throw new Error('Tidak dapat terhubung ke server. Pastikan backend running di http://localhost:5238');
      } else {
        // Error saat setup request
        console.error('❌ Request setup error:', error.message);
        throw new Error(error.message || 'Registrasi gagal');
      }
    }
  },

  // Login user
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Logging in with:', data); // Debug
      
      const response = await api.post('/User/login', data);
      console.log('Login response:', response.data); // Debug
      
      // Simpan token dan user data di localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error full:', error); // Debug
      
      if (error.response) {
        throw new Error(error.response.data?.message || 'Login gagal');
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw new Error(error.message || 'Login gagal');
      }
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};

// Service untuk user
export const userService = {
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data user');
    }
  }
};

export default api;