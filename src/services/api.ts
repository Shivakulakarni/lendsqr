import axios from 'axios';
import { User, PaginatedResponse, FilterOptions } from '../types';

const API_BASE_URL = '/api';

const safeParse = (raw: string | null, fallback: any = null) => {
  if (!raw) return Array.isArray(fallback) ? fallback : (fallback ?? null);
  try { return JSON.parse(raw); } catch { return fallback; }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const registered = safeParse(localStorage.getItem('registered_users'), []);
    const matchedUser = Array.isArray(registered) ? registered.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) : undefined;

    let fullName = '';
    if (matchedUser) {
      fullName = matchedUser.fullName;
    } else if (email.toLowerCase() === 'admin@lendsqr.com') {
      fullName = 'Adedeji';
    } else if (email.toLowerCase() === 'risk@lendsqr.com') {
      fullName = 'Risk Manager';
    } else {
      const prefix = email.split('@')[0];
      fullName = prefix
        .split(/[._-]/)
        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }

    const response = await apiClient.post('/auth/login', { email, password, fullName });
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.user.email,
        fullName: response.data.user.fullName || fullName
      }));
    }
    return response.data;
  },

  register: async (email: string, password: string, orgName: string, fullName: string) => {
    const registered = safeParse(localStorage.getItem('registered_users'), []);
    if (Array.isArray(registered) && registered.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email address is already registered');
    }
    registered.push({ email, password, orgName, fullName });
    localStorage.setItem('registered_users', JSON.stringify(registered));
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser: () => {
    return safeParse(localStorage.getItem('user'));
  },
};

export const userService = {
  getUsers: async (filters: FilterOptions): Promise<PaginatedResponse> => {
    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('perPage', filters.perPage.toString());
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }

    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
};

export default apiClient;
