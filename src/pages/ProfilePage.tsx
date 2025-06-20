import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import defaultAvatar from '../assets/defaultAvatar.png';
import { api, generateMagicLink, generatePegawaiMagicLink } from '../api/apiAuth';
import type { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { getDashboardPathForRole, FILAMENT_DASHBOARD_BASE_URL } from '../config/dashboardUrls';

interface PembeliProfileData {
  NAMA_PEMBELI?: string;
  EMAIL_PEMBELI?: string;
  NO_TELP_PEMBELI?: string;
  TGL_LAHIR_PEMBELI?: string;
  POINT_LOYALITAS_PEMBELI?: number;
}

interface PegawaiProfileData {
  NAMA_PEGAWAI?: string;
  EMAIL_PEGAWAI?: string;
  NO_TELP_PEGAWAI?: string;
  TGL_LAHIR_PEGAWAI?: string;
}

interface OrganisasiProfileData {
  NAMA_ORGANISASI?: string;
  EMAIL_ORGANISASI?: string;
  NO_TELP_ORGANISASI?: string;
  ALAMAT_ORGANISASI?: string;
}

interface PenitipProfileData {
  NAMA_PENITIP?: string;
  EMAIL_PENITIP?: string;
  NO_TELP_PENITIP?: string;
  ALAMAT_PENITIP?: string;
}

type ProfileData = PembeliProfileData &
  OrganisasiProfileData &
  PenitipProfileData &
  PegawaiProfileData;
type UserRole = 'pembeli' | 'organisasi' | 'pegawai' | 'penitip' | null;

export default function ProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({});
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [magicLinkUrl, setMagicLinkUrl] = useState<string | null>(null); // State for magic link URL

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role') as UserRole;
      setUserRole(role);

      if (!token) {
        setError('Sesi tidak valid. Silakan login kembali.');
        setIsLoading(false);
        return;
      }

      if (!role) {
        setError('Peran pengguna tidak ditemukan. Silakan login kembali.');
        setIsLoading(false);
        return;
      }

      let relativeApiUrl = '';
      if (role === 'pembeli') {
        relativeApiUrl = '/pembeli/me';
      } else if (role === 'organisasi') {
        relativeApiUrl = '/organisasi/me';
      } else if (role === 'pegawai') {
        relativeApiUrl = '/pegawai/me';
      } else if (role === 'penitip') {
        relativeApiUrl = '/penitip/me';
      } else {
        setError(`Peran pengguna "${role}" tidak didukung untuk halaman profil ini.`);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(relativeApiUrl);

        if (response.data.success) {
          const userData = response.data.data;
          if (role === 'pembeli') {
            setFormData({
              NAMA_PEMBELI: userData.NAMA_PEMBELI || '',
              EMAIL_PEMBELI: userData.EMAIL_PEMBELI || '',
              NO_TELP_PEMBELI: userData.NO_TELP_PEMBELI || '',
              TGL_LAHIR_PEMBELI: userData.TGL_LAHIR_PEMBELI || '',
              POINT_LOYALITAS_PEMBELI: userData.POINT_LOYALITAS_PEMBELI || 0,
            });
          } else if (role === 'organisasi') {
            setFormData({
              NAMA_ORGANISASI: userData.NAMA_ORGANISASI || '',
              EMAIL_ORGANISASI: userData.EMAIL_ORGANISASI || '',
              NO_TELP_ORGANISASI: userData.NO_TELP_ORGANISASI || '',
              ALAMAT_ORGANISASI: userData.ALAMAT_ORGANISASI || '',
            });
          } else if (role === 'penitip') {
            setFormData({
              NAMA_PENITIP: userData.NAMA_PENITIP || '',
              EMAIL_PENITIP: userData.EMAIL_PENITIP || '',
              NO_TELP_PENITIP: userData.NO_TELP_PENITIP || '',
              ALAMAT_PENITIP: userData.ALAMAT_PENITIP || '',
            });
            // Generate magic link for penitip
            try {
              const email = userData.EMAIL_PENITIP;
              const url = await generateMagicLink(email);
              setMagicLinkUrl(url);
            } catch (err) {
              console.error('Gagal menghasilkan magic link untuk penitip:', err);
              setError('Gagal menghasilkan magic link untuk dashboard penitip.');
            }
          } else if (role === 'pegawai') {
            setFormData({
              NAMA_PEGAWAI: userData.NAMA_PEGAWAI || '',
              EMAIL_PEGAWAI: userData.EMAIL_PEGAWAI || '',
              NO_TELP_PEGAWAI: userData.NO_TELP_PEGAWAI || '',
              TGL_LAHIR_PEGAWAI: userData.TGL_LAHIR_PEGAWAI || '',
            });
            // Generate magic link for pegawai
            try {
              const email = userData.EMAIL_PEGAWAI;
              const url = await generatePegawaiMagicLink(email);
              setMagicLinkUrl(url);
            } catch (err) {
              console.error('Gagal menghasilkan magic link untuk pegawai:', err);
              setError('Gagal menghasilkan magic link untuk dashboard pegawai.');
            }
          }
        } else {
          setError('Gagal memuat data profil: ' + (response.data.message || 'Respon tidak sukses'));
        }
      } catch (err) {
        console.error('Gagal mengambil data profil:', err);
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            'Gagal mengambil data profil. Silakan coba lagi nanti.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userRole) {
      setError('Peran pengguna tidak valid.');
      return;
    }

    let relativeApiUrl = '';
    let payload: any = {};

    if (userRole === 'pembeli') {
      relativeApiUrl = '/pembeli/me/update';
      payload = {
        NAMA_PEMBELI: formData.NAMA_PEMBELI,
        NO_TELP_PEMBELI: formData.NO_TELP_PEMBELI,
      };
    } else if (userRole === 'organisasi') {
      relativeApiUrl = '/organisasi/me/update';
      payload = {
        NAMA_ORGANISASI: formData.NAMA_ORGANISASI,
        NO_TELP_ORGANISASI: formData.NO_TELP_ORGANISASI,
        ALAMAT_ORGANISASI: formData.ALAMAT_ORGANISASI,
      };
    } else if (userRole === 'pegawai') {
      relativeApiUrl = '/pegawai/me/update';
      payload = {
        NAMA_PEGAWAI: formData.NAMA_PEGAWAI,
        NO_TELP_PEGAWAI: formData.NO_TELP_PEGAWAI,
      };
    } else if (userRole === 'penitip') {
      relativeApiUrl = '/penitip/me/update';
      payload = {
        NAMA_PENITIP: formData.NAMA_PENITIP,
        NO_TELP_PENITIP: formData.NO_TELP_PENITIP,
        ALAMAT_PENITIP: formData.ALAMAT_PENITIP,
      };
    } else {
      setError('Peran pengguna tidak didukung untuk pembaruan profil.');
      return;
    }

    try {
      const response = await api.put(relativeApiUrl, payload);

      if (response.data.success) {
        alert('Profil berhasil diperbarui.');
        setIsEditing(false);
        const updatedUserData = response.data.data;
        if (updatedUserData) {
          setFormData((prev) => ({ ...prev, ...updatedUserData }));
        }
      } else {
        setError('Gagal memperbarui profil: ' + (response.data.message || 'Respon tidak sukses'));
      }
    } catch (err) {
      console.error('Gagal memperbarui profil:', err);
      const axiosError = err as AxiosError<{ message?: string }>;
      const errMsg =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Gagal memperbarui profil. Silakan coba lagi nanti.';
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

  const displayName =
    userRole === 'pembeli'
      ? formData.NAMA_PEMBELI
      : userRole === 'organisasi'
      ? formData.NAMA_ORGANISASI
      : userRole === 'pegawai'
      ? formData.NAMA_PEGAWAI
      : userRole === 'penitip'
      ? formData.NAMA_PENITIP
      : 'Pengguna';
  const displayEmail =
    userRole === 'pembeli'
      ? formData.EMAIL_PEMBELI
      : userRole === 'organisasi'
      ? formData.EMAIL_ORGANISASI
      : userRole === 'pegawai'
      ? formData.EMAIL_PEGAWAI
      : userRole === 'penitip'
      ? formData.EMAIL_PENITIP
      : '';

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
                <h3 className="text-lg font-semibold text-center">{displayName || 'Pengguna'}</h3>
              </div>

              {userRole === 'pembeli' && typeof formData.POINT_LOYALITAS_PEMBELI === 'number' && (
                <div className="bg-[#F9F9F9] p-4 rounded-lg mb-6 w-full text-center">
                  <p className="text-sm text-gray-600">Poin</p>
                  <p className="text-lg font-semibold text-[#1E2B32]">
                    {formData.POINT_LOYALITAS_PEMBELI.toLocaleString('id-ID')}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="block p-2 text-[#1E2B32] bg-[#F0F0F0] rounded-md transition"
                >
                  Profile
                </Link>
                {userRole === 'pembeli' && (
                  <>
                    <Link
                      to="/alamat"
                      className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                    >
                      Alamat Saya
                    </Link>
                    <Link
                      to="/riwayat-pesanan"
                      className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                    >
                      Riwayat Pesanan
                    </Link>
                  </>
                )}
                {userRole === 'organisasi' && (
                  <>
                    <Link
                      to="/requestdonasi"
                      className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                    >
                      Request Donasi
                    </Link>
                    <Link
                      to="/historyrequest"
                      className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                    >
                      Riwayat Request Donasi
                    </Link>
                  </>
                )}
                <Link
                  to="/tentang-reusemart"
                  className="block p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                >
                  Tentang ReuseMart
                </Link>
                {userRole && getDashboardPathForRole(userRole) && (
                  <button
                    onClick={() => {
                      if (userRole === 'penitip' && magicLinkUrl) {
                        // For penitip, use the generated magic link
                        window.location.href = magicLinkUrl;
                      } else if (userRole === 'pegawai' && magicLinkUrl) {
                        // For pegawai, use the generated magic link
                        window.location.href = magicLinkUrl;
                      } else {
                        // For other roles, use the default dashboard path
                        const token = localStorage.getItem('token');
                        const dashboardPath = getDashboardPathForRole(userRole);
                        if (token && dashboardPath) {
                          window.location.href = `${FILAMENT_DASHBOARD_BASE_URL}${dashboardPath}?auth_token=${token}`;
                        } else {
                          window.location.href = `${FILAMENT_DASHBOARD_BASE_URL}${
                            dashboardPath || ''
                          }`;
                        }
                      }
                    }}
                    className="block w-full text-left p-2 text-[#1E2B32] hover:bg-[#F0F0F0] rounded-md transition"
                  >
                    Dashboard
                  </button>
                )}
              </div>
            </aside>

            <section className="w-full md:w-3/4 space-y-4">
              {userRole === 'pembeli' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Nama</label>
                    <input
                      type="text"
                      name="NAMA_PEMBELI"
                      value={formData.NAMA_PEMBELI || ''}
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
                      value={displayEmail || ''}
                      readOnly
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-100 border-[#CCC]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email tidak dapat diubah karena digunakan untuk login.
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Nomor Telepon</label>
                    <input
                      type="tel"
                      name="NO_TELP_PEMBELI"
                      value={formData.NO_TELP_PEMBELI || ''}
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
                      readOnly
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-100 border-[#CCC]"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Tanggal lahir tidak dapat diubah setelah verifikasi KYC.
                    </p>
                  </div>
                </>
              )}

              {userRole === 'organisasi' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Nama Organisasi</label>
                    <input
                      type="text"
                      name="NAMA_ORGANISASI"
                      value={formData.NAMA_ORGANISASI || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-2 border rounded-md ${
                        !isEditing ? 'bg-gray-100' : 'bg-white'
                      } border-[#CCC]`}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Email Organisasi</label>
                    <input
                      type="email"
                      name="EMAIL_ORGANISASI"
                      value={displayEmail || ''}
                      readOnly
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-100 border-[#CCC]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email tidak dapat diubah karena digunakan untuk login.
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Nomor Telepon Organisasi</label>
                    <input
                      type="tel"
                      name="NO_TELP_ORGANISASI"
                      value={formData.NO_TELP_ORGANISASI || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-2 border rounded-md ${
                        !isEditing ? 'bg-gray-100' : 'bg-white'
                      } border-[#CCC]`}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Alamat Organisasi</label>
                    <textarea
                      name="ALAMAT_ORGANISASI"
                      value={formData.ALAMAT_ORGANISASI || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full p-2 border rounded-md ${
                        !isEditing ? 'bg-gray-100' : 'bg-white'
                      } border-[#CCC]`}
                    />
                  </div>
                </>
              )}
              {userRole === 'pegawai' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Nama Pegawai</label>
                    <input
                      type="text"
                      name="NAMA_PEGAWAI"
                      value={formData.NAMA_PEGAWAI || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-2 border rounded-md ${
                        !isEditing ? 'bg-gray-100' : 'bg-white'
                      } border-[#CCC]`}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Email Pegawai</label>
                    <input
                      type="email"
                      name="EMAIL_PEGAWAI"
                      value={displayEmail || ''}
                      readOnly
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-100 border-[#CCC]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email tidak dapat diubah karena digunakan untuk login.
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Nomor Telepon Pegawai</label>
                    <input
                      type="tel"
                      name="NO_TELP_PEGAWAI"
                      value={formData.NO_TELP_PEGAWAI || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-2 border rounded-md ${
                        !isEditing ? 'bg-gray-100' : 'bg-white'
                      } border-[#CCC]`}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Tanggal Lahir Pegawai</label>
                    <input
                      type="text"
                      name="TGL_LAHIR_PEGAWAI"
                      value={
                        formData.TGL_LAHIR_PEGAWAI
                          ? new Date(formData.TGL_LAHIR_PEGAWAI).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : ''
                      }
                      readOnly
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-100 border-[#CCC]"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Tanggal lahir tidak dapat diubah setelah verifikasi KYC.
                    </p>
                  </div>
                </>
              )}
              {userRole === 'penitip' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Nama Penitip</label>
                    <input
                      type="text"
                      name="NAMA_PENITIP"
                      value={formData.NAMA_PENITIP || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-2 border rounded-md ${
                        !isEditing ? 'bg-gray-100' : 'bg-white'
                      } border-[#CCC]`}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Email Penitip</label>
                    <input
                      type="email"
                      name="EMAIL_PENITIP"
                      value={displayEmail || ''}
                      readOnly
                      disabled
                      className="w-full p-2 border rounded-md bg-gray-100 border-[#CCC]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email tidak dapat diubah karena digunakan untuk login.
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Nomor Telepon Penitip</label>
                    <input
                      type="tel"
                      name="NO_TELP_PENITIP"
                      value={formData.NO_TELP_PENITIP || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-2 border rounded-md ${
                        !isEditing ? 'bg-gray-100' : 'bg-white'
                      } border-[#CCC]`}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Alamat Penitip</label>
                    <textarea
                      name="ALAMAT_PENITIP"
                      value={formData.ALAMAT_PENITIP || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full p-2 border rounded-md ${
                        !isEditing ? 'bg-gray-100' : 'bg-white'
                      } border-[#CCC]`}
                    />
                  </div>
                </>
              )}

              {(userRole === 'pembeli' || userRole === 'organisasi' || userRole === 'penitip') && (
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
              )}
            </section>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
