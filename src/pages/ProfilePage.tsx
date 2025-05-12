import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import defaultAvatar from '../assets/default-avatar.png';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    username: 'nicholas_tedja',
    name: 'Nicholas Tedja',
    email: 'te***********@gmail.com',
    phone: '*********35',
    storeName: 'nicholas_tedja',
    gender: 'Laki-laki',
    birthDate: '**/**/2004',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Data disimpan:', formData);
    // TODO: Kirim ke backend
  };

  return (
    <div className="bg-[#FFF7E2] min-h-screen text-[#1E2B32]">
      <Header />

      <main className="max-w-[1500px] mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8">
            {/* Sidebar menu */}
            <aside className="w-full md:w-1/4 border-r md:pr-4">
              <div className="flex flex-col items-center mb-6">
                <img
                  //   src={defaultAvatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
                <h3 className="text-lg font-semibold">{formData.username}</h3>
                <button type="button" className="text-blue-600 text-sm hover:underline">
                  Ubah Profil
                </button>
              </div>
              <nav className="space-y-3 text-sm text-[#48635B] font-medium">
                <div className="text-[#1E2B32] font-semibold">Profil</div>
                <div>Bank & Kartu</div>
                <div>Alamat</div>
                <div>Ubah Password</div>
                <div>Pengaturan Notifikasi</div>
                <div>Pengaturan Privasi</div>
                <div>Pesanan Saya</div>
                <div>Notifikasi</div>
                <div>Voucher Saya</div>
                <div>Koin Saya</div>
              </nav>
            </aside>

            {/* Form profile */}
            <section className="w-full md:w-3/4 space-y-4">
              <div>
                <label className="block font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-white border-[#CCC]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  className="w-full p-2 border rounded-md bg-white border-[#CCC]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Jenis Kelamin</label>
                <div className="flex items-center gap-4 mt-2">
                  {['Laki-laki', 'Perempuan', 'Lainnya'].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === option}
                        onChange={() => handleGenderChange(option)}
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
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-white border-[#CCC]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Kamu sudah melakukan verifikasi KYC sehingga tidak dapat mengubah tanggal lahir.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-[#48635B] text-white px-6 py-2 rounded-md hover:bg-[#374b45]"
                >
                  Simpan
                </button>
              </div>
            </section>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
