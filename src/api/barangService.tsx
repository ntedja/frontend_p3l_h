import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Sesuaikan dengan URL backend Anda

export const getBarangListPublic = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/barang/available`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public barang list:', error);
    throw new Error('Gagal mengambil data barang');
  }
};

export const createRequest = async (data: {
  ID_BARANG: number;
  DESKRIPSI_REQUEST: string;
  STATUS_REQUEST: string;
  PENERIMA: string;
}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Anda harus login terlebih dahulu');

    const response = await axios.post(`${API_BASE_URL}/requests`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating request:', error);
    throw new Error(error.response?.data?.message || 'Gagal membuat request');
  }
};

export const getOrganisasiRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Anda harus login terlebih dahulu');

    const response = await axios.get(`${API_BASE_URL}/organisasi/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching organisasi requests:', error);
    throw new Error('Gagal mengambil data request organisasi');
  }
};
