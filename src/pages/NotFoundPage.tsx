import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404 - Halaman Tidak Ditemukan';
    return () => {
      document.title = 'ReuseMart';
    };
  }, []);

  return (
    <div className="bg-[#FFF7E2] text-[#1E2B32] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-6xl font-bold text-[#48635B]">404</h1>
          <h2 className="text-2xl font-semibold mt-4 mb-2">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Maaf, halaman yang Anda cari tidak tersedia.</p>
          <Link
            to="/"
            className="bg-[#3E5B50] hover:bg-[#2D4C41] text-white px-6 py-3 rounded-full shadow-md text-sm transition-all duration-200"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
