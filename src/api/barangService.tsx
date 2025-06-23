import axios from 'axios';

const API_BASE_URL = 'https://reusemart.site/api';

export const getBarangListPublic = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produk`);
    console.log('getBarangListPublic response:', response.data); // Debug log
    return response.data;
  } catch (error: any) {
    console.error('Error fetching public barang list:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_BASE_URL}/produk/available`,
    });
    throw new Error(error.response?.data?.message || 'Gagal mengambil data barang');
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
    console.error('Error creating request:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Gagal membuat request');
  }
};

export const getOrganisasiRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Anda harus login terlebih dahulu');

    const response = await axios.get(`${API_BASE_URL}/produk/request`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('getOrganisasiRequests response:', response.data); // Debug log
    return response.data;
  } catch (error: any) {
    console.error('Error fetching organisasi requests:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || 'Gagal mengambil data request organisasi');
  }
};
