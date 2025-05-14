import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export interface Product {
  name: string;
  price: string;
  category: string;
  image: string;
}

export const getAllAvailableProducts = async (): Promise<Product[]> => {
  try {
    const response: AxiosResponse<Product[]> = await api.get('/barang');
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error('Gagal fetch produk:', err.message);
    return [];
  }
};
