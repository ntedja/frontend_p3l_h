// src/services/apiRequestDonasi.ts
import axios from 'axios';

const API_BASE_URL = 'http://192.168.155.88:8000/api';

export interface TransaksiDonasi {
  ID_TRANSAKSI: number;
  ID_ORGANISASI: number;
  ID_REQUEST: number;
  TGL_DONASI: string;
  PENERIMA: string;
  request?: {
    ID_REQUEST: number;
    DESKRIPSI_REQUEST: string;
    ID_BARANG: number;
    barang?: {
      ID_BARANG: number;
      NAMA_BARANG: string;
      HARGA_BARANG: string;
      KATEGORI_BARANG: string;
      GAMBAR_BARANG: string;
    };
  };
  organisasi?: {
    ID_ORGANISASI: number;
    NAMA_ORGANISASI: string;
  };
}

export const fetchTransaksiDonasi = async (token: string): Promise<TransaksiDonasi[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transaksi-donasi`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      return response.data.data.map((transaksi: any) => ({
        ID_TRANSAKSI: transaksi.ID_TRANSAKSI || transaksi.ID_TRANSAKSI_DONASI || 0,
        ID_ORGANISASI: transaksi.ID_ORGANISASI,
        ID_REQUEST: transaksi.ID_REQUEST,
        TGL_DONASI: transaksi.TGL_DONASI,
        PENERIMA: transaksi.PENERIMA,
        request: transaksi.request || {
          ID_REQUEST: transaksi.ID_REQUEST,
          DESKRIPSI_REQUEST: 'Tidak diketahui',
          ID_BARANG: transaksi.ID_BARANG || 0,
          barang: transaksi.barang || {
            ID_BARANG: 0,
            NAMA_BARANG: 'Barang tidak tersedia',
            HARGA_BARANG: '0',
            KATEGORI_BARANG: 'Tidak diketahui',
            GAMBAR_BARANG: '/images/default.jpg',
          },
        },
        organisasi: transaksi.organisasi || {
          ID_ORGANISASI: transaksi.ID_ORGANISASI,
          NAMA_ORGANISASI: 'Tidak diketahui',
        },
      }));
    }
    throw new Error('Gagal mengambil data transaksi donasi');
  } catch (error: any) {
    console.error('Error fetching transaksi donasi:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data');
  }
};

export const updateTransaksiDonasi = async (
  id: number,
  data: {
    DESKRIPSI_REQUEST: string;
    PENERIMA: string;
  },
  token: string,
): Promise<TransaksiDonasi> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/transaksi-donasi/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Gagal memperbarui transaksi donasi');
  } catch (error: any) {
    console.error('Error updating transaksi donasi:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat memperbarui data');
  }
};

export const deleteTransaksiDonasi = async (id: number, token: string): Promise<void> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/transaksi-donasi/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data.success) {
      throw new Error('Gagal menghapus transaksi donasi');
    }
  } catch (error: any) {
    console.error('Error deleting transaksi donasi:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat menghapus data');
  }
};
