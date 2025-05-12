import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF7E2] text-[#1E2B32] flex flex-col">
      {/* STRIP PUTIH ATAS */}
      <div className="bg-white py-7 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-2xl font-bold text-[#48635B] cursor-pointer"
          >
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            ReuseMart
          </div>
          <h1 className="text-lg font-semibold text-black">Log in</h1>
        </div>
      </div>

      {/* KONTEN LOGIN */}
      <div className="flex-1 bg-[#FFF7E2] flex items-center justify-center px-4">
        <div className="max-w-6xl w-full flex flex-col md:flex-row justify-between items-center gap-10 py-12">
          {/* Kiri - Logo & Deskripsi */}
          <div className="text-center md:text-left flex-1">
            <img src="/logo.png" alt="ReuseMart Logo" className="w-40 h-40 mx-auto md:mx-0" />
            <h1 className="text-[#48635B] text-base md:text-lg font-bold mt-4">
              Jual Beli Barang Bekas di Reuse Mart
            </h1>
            <p className="text-sm mt-2 text-gray-700">
              Gabung dan rasakan kemudahan bertransaksi di Reuse Mart
            </p>
          </div>

          {/* Kanan - Form Login */}
          <div className="bg-white rounded shadow-md p-6 w-full max-w-xs">
            <h2 className="text-xl font-bold text-center mb-4">Login</h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#48635B] text-white py-2 rounded hover:bg-[#2D4C41] text-sm"
              >
                Log In
              </button>
            </form>
            <p className="text-xs text-center mt-4">
              Baru di Reuse Mart?{' '}
              <a href="/register" className="text-blue-600">
                Daftar
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
