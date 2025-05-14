import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set token jika ada
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// ========================
// INTERFACES
// ========================

export interface Barang {
  name: string;
  price: string;
  category: string;
  image: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
  user?: any;
  errors?: Record<string, string[]>;
}

// ========================
// BARANG API FUNCTION
// ========================

export const getBarangList = async (): Promise<Barang[]> => {
  try {
    const response: AxiosResponse<Barang[]> = await api.get('/produk');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const fallbackError = {
      message: 'Gagal mengambil data barang',
    };
    throw axiosError.response?.data || fallbackError;
  }
};
