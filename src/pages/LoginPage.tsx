import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logoImage from '../assets/logo.png';
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('email', email);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // ✅ Tambahkan ini

      if (res.data.role === 'pegawai') {
        localStorage.setItem('jabatan', res.data.jabatan);
      }

      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login gagal. Mohon cek koneksi atau format data.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7E2] text-[#1E2B32] flex flex-col">
      {/* Header */}
      <div className="bg-white py-7 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-2xl font-bold text-[#48635B] cursor-pointer"
          >
            <img src={logoImage} alt="Logo" className="w-17 h-10" />
          </div>
          <h1 className="text-2xl font-semibold text-black">Log in</h1>
        </div>
      </div>

      {/* Konten */}
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

          {/* Form Login */}
          <div className="bg-white rounded-2xl border border-[#E1DBC0] shadow-md p-10 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-[#3E5B50]">Login</h2>
            <form className="space-y-5" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
              />
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E5B50]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end mt-2">
                  <a href="/forgot-password" className="text-sm text-[#3E5B50] hover:underline">
                    Lupa password?
                  </a>
                </div>
              </div>

              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full bg-[#3E5B50] hover:bg-[#2D4C41] text-white py-3 rounded-full shadow-md text-sm"
              >
                Log In
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-[#2F3F3A]">
              Belum punya akun?{' '}
              <a href="/register" className="text-[#3E5B50] font-semibold hover:underline">
                Daftar Sekarang
              </a>
            </p>
            <p className="text-sm text-center mt-6 text-[#2F3F3A]">
              Punya akun Penitip?{' '}
              <a href="/loginpenitip" className="text-[#3E5B50] font-semibold hover:underline">
                Masuk Sebagai Penitip
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-11" />
    </div>
  );
}
