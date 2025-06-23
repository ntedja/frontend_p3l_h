import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImage from '../assets/logo.png';

export default function ResetPasswordPage() {
  useEffect(() => {
    document.title = 'Reusemart - Reset Password';
    return () => {
      document.title = 'ReuseMart';
    };
  }, []);
  const navigate = useNavigate();
  const [password, setPasswordNew] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setErrorMessage('Semua kolom wajib diisi');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password dan Konfirmasi Password tidak cocok');
      return;
    }

    try {
      const res = await axios.post('https://reusemart.site/api/forgot-password', {
        password,
      });

      const { message } = res.data;

      setErrorMessage('');
      setSuccessMessage(message);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
      setErrorMessage(msg);
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7E2] text-[#1E2B32] flex flex-col">
      {/* Strip Atas */}
      <div className="bg-white py-7 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-2xl font-bold text-[#48635B] cursor-pointer"
          >
            <img src={logoImage} alt="Logo" className="w-17 h-10" />
          </div>
          <h1 className="text-2xl font-semibold text-black">Reset Password</h1>
        </div>
      </div>

      {/* Konten */}
      <div className="flex-1 bg-[#FFF7E2] flex items-center justify-center px-4">
        <div className="max-w-6xl w-full flex flex-col md:flex-row justify-between items-center gap-14 py-16">
          {/* Kiri */}
          <div className="text-center md:text-left flex-1">
            <img src={logoImage} alt="ReuseMart Logo" className="w-80 h-70 mx-auto md:mx-0" />
            <h1 className="text-[#48635B] text-xl md:text-2xl font-bold mt-6">
              Reset Password ReuseMart
            </h1>
            <p className="text-base mt-4 text-[#405C53] max-w-md mx-auto md:mx-0">
              Masukkan Password Baru Anda. Sistem akan memproses berdasarkan role Anda.
            </p>
          </div>

          {/* Kanan */}
          <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md border border-[#E1DBC0]">
            <h2 className="text-2xl font-bold text-center mb-6 text-[#3E5B50]">Reset Password</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Masukkan Password Baru"
                value={password}
                onChange={(e) => setPasswordNew(e.target.value)}
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
                required
              />
              <input
                type="password"
                placeholder="Konfirmasi Password Baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
                required
              />
              {errorMessage && <p className="text-sm text-red-600 -mt-2">{errorMessage}</p>}
              {successMessage && <p className="text-sm text-green-600 -mt-2">{successMessage}</p>}
              <button
                type="submit"
                className="w-full bg-[#3E5B50] hover:bg-[#2D4C41] text-white py-3 rounded-full shadow-md text-sm transition-all duration-200"
              >
                Reset Password
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-[#2F3F3A]">
              Ingat password Anda?{' '}
              <a href="/login" className="text-[#3E5B50] font-semibold hover:underline">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Strip Bawah */}
      <div className="bg-white py-11" />
    </div>
  );
}
