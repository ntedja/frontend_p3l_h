import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import defaultAvatar from '../assets/defaultAvatar.png';
import axios from 'axios';
import { Link } from 'react-router-dom';

type ProfileData = {
  NAMA_PEMBELI: string;
  EMAIL_PEMBELI: string;
  NO_TELP_PEMBELI: string;
  TGL_LAHIR_PEMBELI: string;
  POINT_LOYALITAS_PEMBELI: number;
};

type Address = {
  ID_ALAMAT: number;
  JUDUL: string;
  NAMA_JALAN: string;
  PROVINSI: string;
  KABUPATEN: string;
  KECAMATAN: string;
  DESA_KELURAHAN: string;
  is_default: boolean;
};

interface Province {
  id_provinsi: number;
  nama_provinsi: string;
}

interface Regency {
  id_kabupaten_kota: number;
  nama_kabupaten_kota: string;
}

interface District {
  id_kecamatan: number;
  nama_kecamatan: string;
}

interface Village {
  id_desa_kelurahan: number;
  nama_desa_kelurahan: string;
}

export default function AlamatPage() {
  // Address related states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Profile related state
  const [profileData, setProfileData] = useState<ProfileData>({
    NAMA_PEMBELI: '',
    EMAIL_PEMBELI: '',
    NO_TELP_PEMBELI: '',
    TGL_LAHIR_PEMBELI: '',
    POINT_LOYALITAS_PEMBELI: 0,
  });

  // Location dropdown states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  // Address form state
  const [addressFormData, setAddressFormData] = useState({
    JUDUL: '',
    NAMA_JALAN: '',
    selectedProvince: '',
    selectedRegency: '',
    selectedDistrict: '',
    selectedVillage: '',
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/pembeli/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const userData = response.data.data;
          setProfileData({
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
      }
    };

    fetchProfileData();
  }, []);

  // Fetch existing addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/pembeli/me/alamat', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(response.data.data);
        setFilteredAddresses(response.data.data); // Initialize filtered addresses
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        setError('Failed to load addresses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAddresses(addresses);
    } else {
      const filtered = addresses.filter(
        (address) =>
          address.JUDUL.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.NAMA_JALAN.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.PROVINSI.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.KABUPATEN.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.KECAMATAN.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.DESA_KELURAHAN.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredAddresses(filtered);
    }
  }, [searchTerm, addresses]);

  // Fetch provinces on mount (for add form)
  useEffect(() => {
    if (showAddForm && provinces.length === 0) {
      axios
        .get('http://127.0.0.1:8000/api/provinsi')
        .then((response) => setProvinces(response.data))
        .catch((error) => console.error('Failed to load provinces:', error));
    }
  }, [showAddForm, provinces.length]);

  // Handle location dropdown changes
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setAddressFormData({
      ...addressFormData,
      selectedProvince: provinceId,
      selectedRegency: '',
      selectedDistrict: '',
      selectedVillage: '',
    });

    if (provinceId) {
      axios
        .get(`http://127.0.0.1:8000/api/kabupaten/${provinceId}`)
        .then((response) => setRegencies(response.data))
        .catch((error) => console.error('Failed to load regencies:', error));
    } else {
      setRegencies([]);
    }
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regencyId = e.target.value;
    setAddressFormData({
      ...addressFormData,
      selectedRegency: regencyId,
      selectedDistrict: '',
      selectedVillage: '',
    });

    if (regencyId) {
      axios
        .get(`http://127.0.0.1:8000/api/kecamatan/${regencyId}`)
        .then((response) => setDistricts(response.data))
        .catch((error) => console.error('Failed to load districts:', error));
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setAddressFormData({ ...addressFormData, selectedDistrict: districtId, selectedVillage: '' });

    if (districtId) {
      axios
        .get(`http://127.0.0.1:8000/api/desa/${districtId}`)
        .then((response) => setVillages(response.data))
        .catch((error) => console.error('Failed to load villages:', error));
    } else {
      setVillages([]);
    }
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFormData({ ...addressFormData, [name]: value });
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddressFormData({ ...addressFormData, selectedVillage: e.target.value });
  };

  const handleDeleteAddress = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      try {
        const response = await axios.delete(
          `http://127.0.0.1:8000/api/pembeli/me/alamat/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.success) {
          const updatedAddresses = addresses.filter((address) => address.ID_ALAMAT !== id);
          setAddresses(updatedAddresses);
          setFilteredAddresses(updatedAddresses);
        } else {
          setError(response.data.message || 'Failed to delete address');
        }
      } catch (error) {
        console.error('Delete error:');
        setError('Failed to delete address. Please try again.');
      }
    }
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setShowEditForm(true);

    // Pre-fill the form
    setAddressFormData({
      JUDUL: address.JUDUL,
      NAMA_JALAN: address.NAMA_JALAN,
      selectedProvince: address.PROVINSI.toString(),
      selectedRegency: address.KABUPATEN.toString(),
      selectedDistrict: address.KECAMATAN.toString(),
      selectedVillage: address.DESA_KELURAHAN.toString(),
    });

    // Load location dropdowns
    axios
      .get(`http://127.0.0.1:8000/api/kabupaten/${address.PROVINSI}`)
      .then((res) => setRegencies(res.data));
    axios
      .get(`http://127.0.0.1:8000/api/kecamatan/${address.KABUPATEN}`)
      .then((res) => setDistricts(res.data));
    axios
      .get(`http://127.0.0.1:8000/api/desa/${address.KECAMATAN}`)
      .then((res) => setVillages(res.data));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!editingAddress) {
      setError('No address selected for editing');
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/pembeli/me/alamat/${editingAddress.ID_ALAMAT}`,
        {
          JUDUL: addressFormData.JUDUL,
          NAMA_JALAN: addressFormData.NAMA_JALAN,
          PROVINSI: addressFormData.selectedProvince,
          KABUPATEN: addressFormData.selectedRegency,
          KECAMATAN: addressFormData.selectedDistrict,
          DESA_KELURAHAN: addressFormData.selectedVillage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        // Refresh the addresses list
        const updatedResponse = await axios.get(
          'http://127.0.0.1:8000/api/pembeli/me/alamat',
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setAddresses(updatedResponse.data.data);
        setFilteredAddresses(updatedResponse.data.data);
        setShowEditForm(false);
        setEditingAddress(null);
        setError('');
      } else {
        setError(response.data.message || 'Failed to update address');
      }
    } catch (error) {
      console.error('Edit error:');
      setError('Failed to update address. Please try again.');
    }
  };

  const handleSetDefault = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/pembeli/me/alamat/${id}/set-default`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        // Update list alamat agar yang default tampil terbaru
        const updatedAddresses = addresses.map((addr) => ({
          ...addr,
          is_default: addr.ID_ALAMAT === id,
        }));

        setAddresses(updatedAddresses);
        setFilteredAddresses(updatedAddresses);
        setError('');
      } else {
        setError(response.data.message || 'Failed to set default address');
      }
    } catch (error) {
      console.error('Set default address error:', error);
      setError('Failed to set default address. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!addressFormData.selectedVillage) {
      setError('Please select all location fields');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/pembeli/me/alamat',
        {
          JUDUL: addressFormData.JUDUL,
          NAMA_JALAN: addressFormData.NAMA_JALAN,
          PROVINSI: addressFormData.selectedProvince,
          KABUPATEN: addressFormData.selectedRegency,
          KECAMATAN: addressFormData.selectedDistrict,
          DESA_KELURAHAN: addressFormData.selectedVillage,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh addresses list
      const updatedResponse = await axios.get('http://127.0.0.1:8000/api/pembeli/me/alamat', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses(updatedResponse.data.data);
      setFilteredAddresses(updatedResponse.data.data);
      setShowAddForm(false);
      setAddressFormData({
        JUDUL: '',
        NAMA_JALAN: '',
        selectedProvince: '',
        selectedRegency: '',
        selectedDistrict: '',
        selectedVillage: '',
      });
      setError('');
    } catch (error) {
      console.error('Failed to add address:', error);
      setError('Failed to add address. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
        <Header />
        <main className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-12">Loading addresses...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />
      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Alamat Saya</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6 md:flex md:flex-row gap-8">
          {/* Sidebar (same as ProfilePage) */}
          <aside className="w-full md:w-1/4 mb-6 md:mb-0">
            <div className="flex flex-col items-center mb-6">
              <img
                src={defaultAvatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
              <h3 className="text-lg font-semibold">{profileData.NAMA_PEMBELI}</h3>
            </div>

            <div className="bg-[#F9F9F9] p-4 rounded-lg mb-6 w-full text-center">
              <p className="text-sm text-gray-600 mt-4">Poin</p>
              <p className="text-lg font-semibold text-[#1E2B32]">
                {profileData.POINT_LOYALITAS_PEMBELI.toLocaleString('id-ID')}
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

          {/* Main Content */}
          <section className="w-full md:w-3/4 space-y-6">
            <div className="flex justify-between items-center">
              <div className="w-full max-w-md">
                <input
                  type="text"
                  placeholder="Cari alamat..."
                  className="w-full p-2 border rounded-md border-[#CCC] bg-[#ffff]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setShowEditForm(false);
                  setEditingAddress(null);
                }}
                className="bg-[#48635B] text-white px-4 py-2 rounded-md hover:bg-[#374b45] transition-colors"
              >
                + Tambah Alamat Baru
              </button>
            </div>

            {/* Address List */}
            <div className="space-y-4">
              {filteredAddresses.length === 0 ? (
                <p>
                  {searchTerm
                    ? 'Tidak ditemukan alamat yang sesuai'
                    : 'Anda belum memiliki alamat tersimpan'}
                </p>
              ) : (
                filteredAddresses.map((address) => (
                  <div key={address.ID_ALAMAT} className="border rounded-lg p-4 relative">
                    <h3 className="font-semibold flex items-center gap-2">
                      {address.JUDUL}
                      {address.is_default && (
                        <span className="bg-green-500 text-white px-2 py-0.5 text-xs rounded">
                          Default
                        </span>
                      )}
                    </h3>
                    <p>{address.NAMA_JALAN}</p>
                    <p>
                      {address.DESA_KELURAHAN}, {address.KECAMATAN}
                    </p>
                    <p>
                      {address.KABUPATEN}, {address.PROVINSI}
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefault(address.ID_ALAMAT)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                          Jadikan Default
                        </button>
                      )}
                      <button
                        onClick={() => handleEditClick(address)}
                        className="bg-[#48635B] text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.ID_ALAMAT)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Address Form */}
            {(showAddForm || showEditForm) && (
              <form
                onSubmit={showAddForm ? handleSubmit : handleEditSubmit}
                className="border rounded-lg p-4 mt-6"
              >
                <h3 className="font-semibold mb-4">
                  {showAddForm ? 'Tambah Alamat Baru' : 'Edit Alamat'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Judul Alamat*</label>
                    <input
                      type="text"
                      name="JUDUL"
                      value={addressFormData.JUDUL}
                      onChange={handleAddressInputChange}
                      required
                      className="w-full p-2 border rounded-md border-[#CCC] bg-[#ffff]"
                      placeholder="Contoh: Rumah, Kantor, Kos"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Nama Jalan*</label>
                    <input
                      type="text"
                      name="NAMA_JALAN"
                      value={addressFormData.NAMA_JALAN}
                      onChange={handleAddressInputChange}
                      required
                      className="w-full p-2 border rounded-md border-[#CCC] bg-[#ffff]"
                      placeholder="Nama jalan, nomor rumah, gedung"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-medium mb-1">Provinsi*</label>
                      <select
                        value={addressFormData.selectedProvince}
                        onChange={handleProvinceChange}
                        required
                        className="w-full p-2 border rounded-md border-[#CCC] bg-[#ffff]"
                      >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map((province) => (
                          <option key={province.id_provinsi} value={province.id_provinsi}>
                            {province.nama_provinsi}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Kabupaten/Kota*</label>
                      <select
                        value={addressFormData.selectedRegency}
                        onChange={handleRegencyChange}
                        required
                        disabled={!addressFormData.selectedProvince}
                        className="w-full p-2 border rounded-md border-[#CCC] bg-[#ffff]"
                      >
                        <option value="">Pilih Kabupaten/Kota</option>
                        {regencies.map((regency) => (
                          <option key={regency.id_kabupaten_kota} value={regency.id_kabupaten_kota}>
                            {regency.nama_kabupaten_kota}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Kecamatan*</label>
                      <select
                        value={addressFormData.selectedDistrict}
                        onChange={handleDistrictChange}
                        required
                        disabled={!addressFormData.selectedRegency}
                        className="w-full p-2 border rounded-md border-[#CCC] bg-[#ffff]"
                      >
                        <option value="">Pilih Kecamatan</option>
                        {districts.map((district) => (
                          <option key={district.id_kecamatan} value={district.id_kecamatan}>
                            {district.nama_kecamatan}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Desa/Kelurahan*</label>
                      <select
                        value={addressFormData.selectedVillage}
                        onChange={handleVillageChange}
                        required
                        disabled={!addressFormData.selectedDistrict}
                        className="w-full p-2 border rounded-md border-[#CCC] bg-[#ffff]"
                      >
                        <option value="">Pilih Desa/Kelurahan</option>
                        {villages.map((village) => (
                          <option key={village.id_desa_kelurahan} value={village.id_desa_kelurahan}>
                            {village.nama_desa_kelurahan}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setShowEditForm(false);
                        setEditingAddress(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-[#48635B] text-white px-4 py-2 rounded-md hover:bg-[#374b45] transition-colors"
                    >
                      {showAddForm ? 'Simpan Alamat' : 'Update Alamat'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
