import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !password ||
      !confirmPassword ||
      password.length < 8 ||
      password !== confirmPassword
    ) {
      if (!password || !confirmPassword) {
        setErrorMessage('Semua field wajib diisi');
      } else if (password.length < 8) {
        setErrorMessage('Password minimal 8 karakter');
      } else if (password !== confirmPassword) {
        setErrorMessage('Konfirmasi password tidak cocok');
      }
      return;
    }
    setErrorMessage('');
    navigate('/');
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
          {/* Kiri - Logo & Deskripsi */}
          <div className="text-center md:text-left flex-1">
            <img src={logoImage} alt="ReuseMart Logo" className="w-80 h-70 mx-auto md:mx-0" />
            <h1 className="text-[#48635B] text-xl md:text-2xl font-bold mt-6">
              Jual Beli Barang Bekas di ReuseMart
            </h1>
            <p className="text-base mt-4 text-[#405C53] max-w-md mx-auto md:mx-0">
              Gabung dan rasakan kemudahan bertransaksi di ReuseMart, platform konsinyasi barang bekas terpercaya.
            </p>
          </div>

          {/* Kanan - Form Register */}
          <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md border border-[#E1DBC0]">
            <h2 className="text-2xl font-bold text-center mb-6 text-[#3E5B50]">Register Pembeli</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
                required
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm pr-12 focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E5B50]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Konfirmasi Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm pr-12 focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E5B50]"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <input
                type="tel"
                placeholder="No. HP"
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Alamat"
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#3E5B50] focus:outline-none"
                required
              />

              {/* Error Message */}
              {errorMessage && (
                <p className="text-sm text-red-600 -mt-2">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#3E5B50] hover:bg-[#2D4C41] text-white py-3 rounded-full shadow-md text-sm transition-all duration-200 hover:shadow-lg active:scale-[.98]"
              >
                Daftar Sekarang
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
