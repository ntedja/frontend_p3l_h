import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logoImage from '../assets/logo.png';
import { signUp, getErrorMessage } from '../api/apiAuth';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    NAMA_PEMBELI: '',
    TGL_LAHIR_PEMBELI: '',
    NO_TELP_PEMBELI: '',
    EMAIL_PEMBELI: '',
    PASSWORD_PEMBELI: '',
    PASSWORD_PEMBELI_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Validasi sederhana di frontend
    if (formData.PASSWORD_PEMBELI !== formData.PASSWORD_PEMBELI_confirmation) {
      setErrorMessage('Konfirmasi password tidak cocok');
      setIsLoading(false);
      return;
    }

    if (formData.PASSWORD_PEMBELI.length < 8) {
      setErrorMessage('Password minimal 8 karakter');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(formData);

      if (result.success) {
        // Registrasi berhasil
        navigate('/login', {
          state: { registrationSuccess: true, email: formData.EMAIL_PEMBELI },
        });
      } else {
        // Registrasi gagal
        setErrorMessage(getErrorMessage(result));
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7E2] text-[#1E2B32] flex flex-col">
      {/* STRIP PUTIH ATAS */}
      <div className="bg-white py-7 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-2xl font-bold text-[#48635B] cursor-pointer"
          >
            <img src={logoImage} alt="Logo" className="w-17 h-10" />
            Registrasi
          </div>
        </div>
      </div>

      {/* KONTEN REGISTER */}
      <div className="flex-1 bg-[#FFF7E2] flex items-center justify-center px-4">
        <div className="max-w-6xl w-full flex flex-col md:flex-row justify-between items-center gap-14 py-16">
          {/* Kiri */}
          <div className="text-center md:text-left flex-1">
            <img src={logoImage} alt="ReuseMart Logo" className="w-80 h-70 mx-auto md:mx-0" />
            <h1 className="text-[#48635B] text-xl md:text-2xl font-bold mt-6">
              Jual Beli Barang Bekas di ReuseMart
            </h1>
            <p className="text-base mt-4 text-[#405C53] max-w-md mx-auto md:mx-0">
              Gabung dan rasakan kemudahan bertransaksi di ReuseMart, platform konsinyasi barang
              bekas terpercaya.
            </p>
          </div>

          {/* Kanan */}
          <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md border border-[#E1DBC0]">
            <h2 className="text-2xl font-bold text-center mb-6 text-[#3E5B50]">Register Pembeli</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="NAMA_PEMBELI"
                placeholder="Nama Lengkap"
                value={formData.NAMA_PEMBELI}
                onChange={handleChange}
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
                required
              />
              <input
                type="date"
                name="TGL_LAHIR_PEMBELI"
                placeholder="Tanggal Lahir"
                value={formData.TGL_LAHIR_PEMBELI}
                onChange={handleChange}
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
                required
              />
              <input
                type="email"
                name="EMAIL_PEMBELI"
                placeholder="Email"
                value={formData.EMAIL_PEMBELI}
                onChange={handleChange}
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="PASSWORD_PEMBELI"
                  placeholder="Password"
                  value={formData.PASSWORD_PEMBELI}
                  onChange={handleChange}
                  className="w-full pr-12 border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="PASSWORD_PEMBELI_confirmation"
                  placeholder="Konfirmasi Password"
                  value={formData.PASSWORD_PEMBELI_confirmation}
                  onChange={handleChange}
                  className="w-full pr-12 border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <input
                type="tel"
                name="NO_TELP_PEMBELI"
                placeholder="No. HP"
                value={formData.NO_TELP_PEMBELI}
                onChange={handleChange}
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
                required
              />

              {errorMessage && <p className="text-sm text-red-600 -mt-2">{errorMessage}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#3E5B50] hover:bg-[#2D4C41] text-white py-3 rounded-full shadow-md text-sm transition-all duration-200 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-[#2F3F3A]">
              Punya akun pembeli?{' '}
              <a href="/login" className="text-[#3E5B50] font-semibold hover:underline">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* STRIP PUTIH BAWAH */}
      <div className="bg-white py-11" />
    </div>
  );
}
