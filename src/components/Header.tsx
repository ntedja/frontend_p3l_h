import { Search, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-[#FFF7E2] text-[#2D4C41] border-b border-gray-300 pt-4">
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
            <a href="#" className="hover:text-[#2D4C41]">
              Tentang ReuseMart
            </a>
            <a href="#" className="hover:text-[#2D4C41]">
              Mitra ReuseMart
            </a>
            <a href="#" className="hover:text-[#2D4C41]">
              Mulai Berjualan
            </a>
            <a href="#" className="hover:text-[#2D4C41]">
              ReuseMart Care
            </a>
          </nav>
        </div>

        {/* ROW 2 */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-2xl font-bold text-[#48635B] whitespace-nowrap">
            <img src="{logoImage}" alt="ReuseMart Logo" className="w-8 h-8" />
            ReuseMart
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#48635B] w-4 h-4" />
            <input
              type="text"
              placeholder="Cari di ReuseMart"
              className="w-full border border-[#48635B] rounded-xl pl-10 pr-4 py-2 text-sm bg-transparent text-[#48635B] placeholder:text-[#48635B] focus:outline-none focus:ring-1 focus:ring-[#48635B]"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ShoppingCart className="w-5 h-5 text-[#48635B]" />
            <button
              onClick={() => navigate('/login')}
              className="border border-[#48635B] text-[#48635B] px-4 py-1.5 rounded hover:bg-[#F7F3EC]"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-[#48635B] text-white px-4 py-1.5 rounded hover:bg-[#2D4C41]"
            >
              Daftar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
