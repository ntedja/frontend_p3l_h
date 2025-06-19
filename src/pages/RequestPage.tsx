import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/apiAuth'; // Import the centralized API instance

import Header from '../components/Header'; // Import Header
import Footer from '../components/Footer'; // Import Footer
interface RequestItem {
  ID_REQUEST: number;
  NAMA_BARANG_REQUEST: string;
  DESKRIPSI_REQUEST: string;
  STATUS_REQUEST: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  NAMA_BARANG_REQUEST: string;
  DESKRIPSI_REQUEST: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

const RequestPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccessGranted, setIsAccessGranted] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    NAMA_BARANG_REQUEST: '',
    DESKRIPSI_REQUEST: '',
  });
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fungsi untuk mengambil daftar request
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/organisasi/requests`);
      setRequests(response.data.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized. Please login.');
        } else {
          setError(`Failed to fetch requests: ${err.response.data.message || err.message}`);
        }
      } else {
        setError(`Failed to fetch requests: ${String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const memoizedFetchRequests = useCallback(fetchRequests, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'organisasi') {
      setIsAccessGranted(true);
      memoizedFetchRequests();
    } else {
      setIsAccessGranted(false);
      navigate('/login', {
        state: {
          loginRequiredMessage: 'Anda harus login sebagai organisasi untuk mengakses halaman ini.',
          from: location.pathname, // Optional: to redirect back after login
        },
        replace: true, // Replace the current entry in the history stack
      });
    }
  }, [navigate, location.pathname, memoizedFetchRequests]);




  // Handle perubahan input form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newState = { ...prev };
        delete newState[name];
        return newState;
      });
    }
  };

  // Handle submit form (tambah atau edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});
    setSuccessMessage(null);

    try {
      let response;
      if (editingRequest) {
        // Mode Edit
        response = await api.put(`/organisasi/requests/${editingRequest.ID_REQUEST}`, formData);
        setSuccessMessage('Request berhasil diperbarui!');
      } else {
        // Mode Tambah
        response = await api.post(`/organisasi/requests`, formData);
        setSuccessMessage('Request berhasil dibuat!');
      }

      // Refresh daftar request
      memoizedFetchRequests();
      // Reset form
      setFormData({ NAMA_BARANG_REQUEST: '', DESKRIPSI_REQUEST: '' });
      setEditingRequest(null);
    } catch (err) {
      console.error('Error submitting request:', err);
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 422) {
          // Handle validation errors
          setValidationErrors(err.response.data.errors || {});
          setError('Validasi gagal. Mohon periksa input Anda.');
        } else if (
          err.response.status === 401 ||
          err.response.status === 403 ||
          err.response.status === 404
        ) {
          setError(
            err.response.data.message || 'Aksi tidak diizinkan atau request tidak ditemukan.',
          );
        } else {
          setError(`Gagal menyimpan request: ${err.response.data.message || err.message}`);
        }
      } else {
        setError(`Gagal menyimpan request: ${String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Set form untuk mode edit
  const handleEditClick = (request: RequestItem) => {
    setEditingRequest(request);
    setFormData({
      NAMA_BARANG_REQUEST: request.NAMA_BARANG_REQUEST,
      DESKRIPSI_REQUEST: request.DESKRIPSI_REQUEST,
    });
    setValidationErrors({}); // Clear previous validation errors
    setSuccessMessage(null);
  };

  // Batal mode edit
  const handleCancelEdit = () => {
    setEditingRequest(null);
    setFormData({ NAMA_BARANG_REQUEST: '', DESKRIPSI_REQUEST: '' });
    setValidationErrors({});
    setSuccessMessage(null);
  };

  // Handle hapus request
  const handleDeleteClick = async (requestId: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus request ini?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await api.delete(`/organisasi/requests/${requestId}`);
      setSuccessMessage('Request berhasil dihapus!');
      // Refresh daftar request
      memoizedFetchRequests();
    } catch (err) {
      console.error('Error deleting request:', err);
      if (axios.isAxiosError(err) && err.response) {
        if (
          err.response.status === 401 ||
          err.response.status === 403 ||
          err.response.status === 404
        ) {
          setError(
            err.response.data.message || 'Aksi tidak diizinkan atau request tidak ditemukan.',
          );
        } else {
          setError(`Gagal menghapus request: ${err.response.data.message || err.message}`);
        }
      } else {
        setError(`Gagal menghapus request: ${String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAccessGranted) {
    // Show a loading/redirecting message while the check is in progress or before navigation takes effect
    return (
      <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-[#3E5B50]">Mengarahkan ke halaman login...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32] flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#3E5B50]">
          Manajemen Request Donasi
        </h1>
        {loading && <p className="text-center py-4 text-lg text-[#3E5B50]">Memuat data...</p>}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            Error: {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
            {successMessage}
          </div>
        )}

        {/* Form Tambah/Edit Request */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full mb-10 border border-[#E1DBC0]">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#3E5B50]">
            {editingRequest ? 'Edit Request' : 'Tambah Request Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="NAMA_BARANG_REQUEST"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Barang yang Dibutuhkan:
              </label>
              <input
                type="text"
                id="NAMA_BARANG_REQUEST"
                name="NAMA_BARANG_REQUEST"
                value={formData.NAMA_BARANG_REQUEST}
                onChange={handleInputChange}
                required
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
              />
              {validationErrors.NAMA_BARANG_REQUEST && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.NAMA_BARANG_REQUEST[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="DESKRIPSI_REQUEST"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Deskripsi:
              </label>
              <textarea
                id="DESKRIPSI_REQUEST"
                name="DESKRIPSI_REQUEST"
                value={formData.DESKRIPSI_REQUEST}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
              ></textarea>
              {validationErrors.DESKRIPSI_REQUEST && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.DESKRIPSI_REQUEST[0]}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3E5B50] hover:bg-[#2D4C41] text-white py-2.5 rounded-lg shadow-md text-sm font-semibold transition-colors duration-150 disabled:opacity-50"
              >
                {loading ? 'Memproses...' : editingRequest ? 'Simpan Perubahan' : 'Tambah Request'}
              </button>
              {editingRequest && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded-lg shadow-md text-sm font-semibold transition-colors duration-150"
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Daftar Request */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-[#E1DBC0]">
          <h2 className="text-2xl font-bold text-center my-6 text-[#3E5B50]">Request Anda</h2>
          {requests.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 py-10">Belum ada request donasi.</p>
          )}
          {requests.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#48635B]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Barang yang Dibutuhkan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Dibuat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.ID_REQUEST} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {request.NAMA_BARANG_REQUEST}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {request.DESKRIPSI_REQUEST}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.STATUS_REQUEST === 'Menunggu'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.STATUS_REQUEST === 'Diterima'
                              ? 'bg-green-100 text-green-800'
                              : request.STATUS_REQUEST === 'Ditolak'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {request.STATUS_REQUEST}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.STATUS_REQUEST === 'Menunggu' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(request)}
                              disabled={loading}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors text-xs px-3 py-1 rounded-md border border-indigo-500 hover:bg-indigo-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(request.ID_REQUEST)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-900 transition-colors text-xs px-3 py-1 rounded-md border border-red-500 hover:bg-red-50"
                            >
                              Hapus
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Tidak ada aksi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestPage;
