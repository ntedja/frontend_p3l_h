import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = axios.create({
  // Export the api instance
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the Authorization header
export const setAuthToken = (token: string | null) => {
  // Export setAuthToken
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize the Authorization header from localStorage
setAuthToken(localStorage.getItem('token'));

// ========================
// INTERFACES
// ========================

//Pembeli
interface PembeliRegisterData {
  NAMA_PEMBELI: string;
  TGL_LAHIR_PEMBELI: string;
  NO_TELP_PEMBELI: string;
  EMAIL_PEMBELI: string;
  PASSWORD_PEMBELI: string;
  PASSWORD_PEMBELI_confirmation: string;
}

interface LoginData {
  EMAIL_PEMBELI: string;
  PASSWORD_PEMBELI: string;
}

interface PenitipRegisterData {
  NAMA_PENITIP: string;
  ALAMAT_PENITIP: string;
  NO_TELP_PENITIP: string;
  EMAIL_PENITIP: string;
  PASSWORD_PENITIP: string;
  PASSWORD_PENITIP_confirmation: string;
}

interface PenitipLoginData {
  EMAIL_PENITIP: string;
  PASSWORD_PENITIP: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
  user?: any;
  errors?: Record<string, string[]>;
}

//Organisasi
interface OrganisasiRegisterData {
  NAMA_ORGANISASI: string;
  ALAMAT_ORGANISASI: string;
  NO_TELP_ORGANISASI: string;
  EMAIL_ORGANISASI: string;
  PASSWORD_ORGANISASI: string;
  PASSWORD_ORGANISASI_confirmation: string;
}

interface OrganisasiLoginData {
  EMAIL_ORGANISASI: string;
  PASSWORD_ORGANISASI: string;
}

// ========================
// AUTH FUNCTIONS
// ========================

export const signUp = async (data: PembeliRegisterData): Promise<ApiResponse> => {
  try {
    const formattedData = {
      ...data,
      TGL_LAHIR_PEMBELI: formatDateForBackend(data.TGL_LAHIR_PEMBELI),
    };

    const response: AxiosResponse<ApiResponse> = await api.post('/pembeli/register', formattedData);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data.data));
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    throw (
      axiosError.response?.data || {
        success: false,
        message: 'Terjadi kesalahan saat registrasi',
      }
    );
  }
};

export const signIn = async (data: LoginData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post('/pembeli/login', data);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data.data));
      setAuthToken(response.data.token); // Update Authorization header
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    throw (
      axiosError.response?.data || {
        success: false,
        message: 'Terjadi kesalahan saat login',
      }
    );
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await api.post('/pembeli/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthToken(null);

    localStorage.clear();
    sessionStorage.clear();
  }
};

// ========================
// PEGAWAI
// ========================

export const pegawaiSignIn = async (data: { EMAIL_PEGAWAI: string; PASSWORD_PEGAWAI: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pegawai/login`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('pegawai', JSON.stringify(response.data.pegawai || response.data.data));
      setAuthToken(response.data.token); // Update Authorization header for the shared api instance
    }
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: 'Terjadi kesalahan saat login pegawai',
      }
    );
  }
};

// ========================
// ORGANISASI
// ========================

export const registerOrganisasi = async (data: OrganisasiRegisterData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post('/organisasi/register', data);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setAuthToken(response.data.token); // Update Authorization header
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    throw (
      axiosError.response?.data || {
        success: false,
        message: 'Terjadi kesalahan saat registrasi organisasi',
      }
    );
  }
};

export const loginOrganisasi = async (data: OrganisasiLoginData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post('/organisasi/login', data);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setAuthToken(response.data.token); // Update Authorization header
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    throw (
      axiosError.response?.data || {
        success: false,
        message: 'Terjadi kesalahan saat login organisasi',
      }
    );
  }
};

// ========================
// UTILITIES
// ========================

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

const formatDateForBackend = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getErrorMessage = (error: ApiResponse): string => {
  if (error.errors) {
    return Object.values(error.errors).flat().join(', ');
  }
  return error.message || 'Terjadi kesalahan';
};

export const registerPenitip = async (data: PenitipRegisterData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post('/penitip/register', data);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setAuthToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    throw (
      axiosError.response?.data || {
        success: false,
        message: 'Terjadi kesalahan saat registrasi penitip',
      }
    );
  }
};

interface PenitipLoginData {
  email: string;
  password: string;
}

export const loginPenitip = async (data: PenitipLoginData): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post('/penitip/login', data);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setAuthToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    throw (
      axiosError.response?.data || {
        success: false,
        message: 'Terjadi kesalahan saat login penitip',
      }
    );
  }
};

export const logoutPenitip = async (): Promise<void> => {
  try {
    await api.post('/penitip/logout');
  } catch (error) {
    console.error('Penitip logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthToken(null);
  }
};
