// services/api.ts
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
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
}

export interface RequestData {
  ID_BARANG: number;
  DESKRIPSI_REQUEST: string;
  STATUS_REQUEST: string;
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

// ========================
// REQUEST API FUNCTION
// ========================

export const createRequest = async (data: RequestData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post('/requests', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const fallbackError = {
      message: 'Gagal membuat request',
    };
    throw axiosError.response?.data || fallbackError;
  }
};
