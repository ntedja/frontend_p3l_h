import axios from 'axios';

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

export interface Pesanan {
  id: number;
  kode: string;
  tanggal: string;
  status: string;
  total: number;
  item_count: number;
}

export const fetchRiwayatPesanan = async (token: string): Promise<Pesanan[]> => {
  try {
    const response = await api.get('/pesanan', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Gagal mengambil data riwayat pesanan');
  } catch (error: any) {
    console.error('Error fetching riwayat pesanan:', error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.statusText || 'Terjadi kesalahan server',
      );
    } else if (error.request) {
      throw new Error('Tidak ada respon dari server');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan saat memuat data');
    }
  }
};
