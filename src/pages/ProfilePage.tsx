import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import defaultAvatar from '../assets/defaultAvatar.png';

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  storeName: string;
  gender: string;
  birthDate: string;
};

export default function ProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    gender: '',
    birthDate: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();

        setFormData({
          name: data.nama || '',
          email: data.email || '',
          phone: data.no_telp || '',
          storeName: data.nama_toko || '',
          gender: data.jenis_kelamin || '',
          birthDate: data.tanggal_lahir || '',
        });
      } catch (error) {
        console.error('Gagal mengambil data profil:', error);
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

  const handleGenderChange = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Gagal memperbarui profil');

      alert('Profil berhasil diperbarui.');
      setIsEditing(false);
    } catch (error) {
      console.error('Gagal memperbarui profil:', error);
    }
  };

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />
      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow p-6 md:flex md:flex-row gap-8">
            <aside className="w-full md:w-1/4 mb-6 md:mb-0">
              <div className="flex flex-col items-center mb-6">
                <img
                  src={defaultAvatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
                <h3 className="text-lg font-semibold">{formData.name}</h3>
              </div>

              <div className="bg-[#F9F9F9] p-4 rounded-lg mb-6 w-full text-center">
                <p className="text-sm text-gray-600">Saldo</p>
                <p className="text-lg font-semibold text-[#1E2B32]">Rp120.000</p>
                <p className="text-sm text-gray-600 mt-4">Poin</p>
                <p className="text-lg font-semibold text-[#1E2B32]">1.250</p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
              >
                Edit Profil
              </button>
            </aside>

            {/* Formulir Profil */}
            <section className="w-full md:w-3/4 space-y-4">
              <div>
                <label className="block font-medium mb-1">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md bg-white border-[#CCC]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md bg-white border-[#CCC]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md bg-white border-[#CCC]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Nama Toko</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-md bg-white border-[#CCC]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Jenis Kelamin</label>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  {['Laki-laki', 'Perempuan', 'Lainnya'].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === option}
                        onChange={() => handleGenderChange(option)}
                        disabled={!isEditing}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Tanggal Lahir</label>
                <input
                  type="text"
                  name="birthDate"
                  value={formData.birthDate}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-100 border-[#CCC]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Kamu sudah melakukan verifikasi KYC sehingga tidak dapat mengubah tanggal lahir.
                </p>
              </div>

              {isEditing && (
                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-[#48635B] text-white px-6 py-2 rounded-md hover:bg-[#374b45]"
                  >
                    Simpan Perubahan
                  </button>
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
