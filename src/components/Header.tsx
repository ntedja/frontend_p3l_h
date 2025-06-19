import { Search, ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  {
    /* State to control the visibility of the logout modal */
  }
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    {
      /* Close the logout modal */
    }
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <header className="w-full bg-[#FFF7E2] text-[#2D4C41] border-b border-gray-300 pt-4 relative">
      <div className="max-w-full mx-auto px-12 py-3 flex flex-col gap-3">
        {/* ROW 1 */}
        <div className="flex justify-between text-sm text-[#48635B]">
          <div className="flex items-center gap-2 font-normal">
            <a href="#" className="hover:underline">
              Download
            </a>
            <span>|</span>
            <span>Ikuti kami di</span>
            <div className="flex items-center gap-2 ml-1">
              <a href="#" aria-label="Instagram" className="hover:text-[#2D4C41]">
                <i className="bi bi-instagram text-lg"></i>
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-[#2D4C41]">
                <i className="bi bi-facebook text-lg"></i>
              </a>
            </div>
          </div>
          <nav className="flex items-center gap-5 font-normal">
            <Link to="/tentang-reusemart" className="hover:text-[#2D4C41]">
              Tentang ReuseMart
            </Link>
            <Link to="/mitra-reusemart" className="hover:text-[#2D4C41]">
              Mitra ReuseMart
            </Link>
            {/* <Link to="/mulai-jualan" className="hover:text-[#2D4C41]">
              Mulai Berjualan
            </Link> */}
            <Link to="/requestdonasi" className="hover:text-[#2D4C41]">
              Request Donasi
            </Link>
            <Link to="/reusemart-care" className="hover:text-[#2D4C41]">
              ReuseMart Care
            </Link>
          </nav>
        </div>

        {/* ROW 2 */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-bold text-[#48635B] whitespace-nowrap">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-[#48635B] cursor-pointer"
            >
              <img src={logoImage} alt="ReuseMart Logo" className="w-17 h-10" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#48635B] w-4 h-4" />
            <input
              type="text"
              placeholder="Cari di ReuseMart"
              className="w-full border border-[#48635B] rounded-xl pl-10 pr-4 py-2 text-sm bg-transparent text-[#48635B] placeholder:text-[#48635B] focus:outline-none focus:ring-1 focus:ring-[#48635B]"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 text-sm whitespace-nowrap ml-5">
            {isLoggedIn ? (
              <>
                <ShoppingCart
                  className="w-5 h-5 text-[#48635B] cursor-pointer mr-3"
                  onClick={() => navigate('/cart')}
                />
                <User
                  className="w-5 h-5 text-[#48635B] cursor-pointer mr-3"
                  onClick={() => navigate('/profile')}
                />
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-[#48635B] text-white px-4 py-1.5 rounded"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#48635B] text-white px-4 py-1.5 rounded"
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-[#48635B] text-white px-4 py-1.5 rounded"
                >
                  Daftar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold mb-4 text-center text-[#2D4C41]">
              Konfirmasi Logout
            </h2>
            <p className="mb-6 text-center text-[#48635B]">
              Apakah Anda yakin ingin keluar dari akun Anda?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleLogout}
                className="bg-[#48635B] text-white px-5 py-2 rounded hover:bg-[#3a5a3e]"
              >
                Ya
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
