import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import defaultAvatar from '../assets/defaultAvatar.png';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

type ProfileData = {
  NAMA_PEMBELI: string;
  EMAIL_PEMBELI: string;
  NO_TELP_PEMBELI: string;
  TGL_LAHIR_PEMBELI: string;
  POINT_LOYALITAS_PEMBELI: number;
};

export default function ProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({
    NAMA_PEMBELI: '',
    EMAIL_PEMBELI: '',
    NO_TELP_PEMBELI: '',
    TGL_LAHIR_PEMBELI: '',
    POINT_LOYALITAS_PEMBELI: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPointModal, setShowPointModal] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://192.168.18.73:8000/api/pembeli/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const userData = response.data.data;
          setFormData({
            NAMA_PEMBELI: userData.NAMA_PEMBELI || '',
            EMAIL_PEMBELI: userData.EMAIL_PEMBELI || '',
            NO_TELP_PEMBELI: userData.NO_TELP_PEMBELI || '',
            TGL_LAHIR_PEMBELI: userData.TGL_LAHIR_PEMBELI || '',
            POINT_LOYALITAS_PEMBELI: userData.POINT_LOYALITAS_PEMBELI || 0,
          });
        } else {
          setError('Gagal memuat data profil');
        }
      } catch (error) {
        console.error('Gagal mengambil data profil:', error);
        setError('Gagal mengambil data profil. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Token tidak ditemukan. Silakan login kembali.');
      return;
    }

    try {
      const response = await axios.put(
        'http://192.168.18.73:8000/api/pembeli/me/update',
        {
          NAMA_PEMBELI: formData.NAMA_PEMBELI,
          NO_TELP_PEMBELI: formData.NO_TELP_PEMBELI,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        alert('Profil berhasil diperbarui.');
        setIsEditing(false);
      } else {
        setError('Gagal memperbarui profil');
      }
    } catch (error: any) {
      console.error('Gagal memperbarui profil:', error);
      const errMsg =
        error.response?.data?.message || 'Gagal memperbarui profil. Silakan coba lagi nanti.';
      setError(errMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
        <Header />
        <main className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-12">Memuat data profil...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />
      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow p-6 md:flex md:flex-row gap-8">
            <aside className="w-full md:w-1/4 mb-6 md:mb-0">
              <div className="flex flex-col items-center mb-6">
                <img
                  src={defaultAvatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
                <Link
                  to="#"
                  className="text-lg font-semibold hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPointModal(true);
                  }}
                >
                  {formData.NAMA_PEMBELI}
                </Link>
                {showPointModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                      <img
                        src={defaultAvatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover mb-2 justify-center mx-auto"
                      />
                      <h2 className="text-lg font-semibold mb-4 text-center text-[#2D4C41]">
                        {formData.NAMA_PEMBELI}
                      </h2>
                      <p className="mb-6 text-center text-[#48635B]">
                        Kamu memiliki{' '}
                        <span className="font-bold">
                          {formData.POINT_LOYALITAS_PEMBELI.toLocaleString('id-ID')}
                        </span>{' '}
                        poin loyalitas.
                      </p>
                      <div className="flex justify-center">
                        <button
                          onClick={() => setShowPointModal(false)}
                          className="bg-[#48635B] text-white px-5 py-2 rounded hover:bg-[#3a5a3e]"
                        >
                          Baik, Terima Kasih 😘
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#F9F9F9] p-4 rounded-lg mb-6 w-full text-center">
                <p className="text-sm text-gray-600">Poin</p>
                <p className="text-lg font-semibold text-[#1E2B32]">
                  {formData.POINT_LOYALITAS_PEMBELI.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Navigation Links */}
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                >
                  Profile
                </Link>
                <Link
                  to="/alamat"
                  className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                >
                  Alamat Saya
                </Link>
                <Link
                  to="/tentang-kami"
                  className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                >
                  Tentang Kami
                </Link>
                <Link
                  to="/bantuan"
                  className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                >
                  Pusat Bantuan
                </Link>
                <Link
                  to="/riwayat-pesanan"
                  className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                >
                  Riwayat Pesanan
                </Link>
              </div>
            </aside>

            {/* Formulir Profil */}
            <section className="w-full md:w-3/4 space-y-4">
              <div>
                <label className="block font-medium mb-1">Nama</label>
                <input
                  type="text"
                  name="NAMA_PEMBELI"
                  value={formData.NAMA_PEMBELI}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-md ${
                    !isEditing ? 'bg-gray-100' : 'bg-white'
                  } border-[#CCC]`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="EMAIL_PEMBELI"
                  value={formData.EMAIL_PEMBELI}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full p-2 border rounded-md bg-gray-100 border-[#CCC]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email tidak dapat diubah karena digunakan untuk login
                </p>
              </div>

              <div>
                <label className="block font-medium mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  name="NO_TELP_PEMBELI"
                  value={formData.NO_TELP_PEMBELI}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-md ${
                    !isEditing ? 'bg-gray-100' : 'bg-white'
                  } border-[#CCC]`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Tanggal Lahir</label>
                <input
                  type="text"
                  name="TGL_LAHIR_PEMBELI"
                  value={
                    formData.TGL_LAHIR_PEMBELI
                      ? new Date(formData.TGL_LAHIR_PEMBELI).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : ''
                  }
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-100 border-[#CCC]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Kamu sudah melakukan verifikasi KYC sehingga tidak dapat mengubah tanggal lahir.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`${
                    isEditing ? 'bg-gray-500' : 'bg-[#48635B]'
                  } text-white px-6 py-2 rounded-md hover:opacity-90`}
                >
                  {isEditing ? 'Batal Edit' : 'Edit Profil'}
                </button>

                {isEditing && (
                  <button
                    type="submit"
                    className="bg-[#48635B] text-white px-6 py-2 rounded-md hover:bg-[#374b45]"
                  >
                    Simpan Perubahan
                  </button>
                )}
              </div>
            </section>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
