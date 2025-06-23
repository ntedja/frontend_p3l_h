import logoImage from '../assets/Logo1.png';
import qrImage from '../assets/QR-ReuseMart-Mobile.png';

export default function Footer() {
  return (
    <footer className="bg-[#D2CDB7] mt-10 pt-6">
      <div className="max-w-full mx-auto px-6 flex justify-center gap-x-20 items-start flex-wrap text-[#2D4C41] text-sm pb-6">
        {/* Kiri - Logo */}
        <div className="flex items-center gap-2 text-2xl font-bold text-[#48635B] whitespace-nowrap mt-5">
          <img src={logoImage} alt="ReuseMart Logo" className="w-100 h-70 cursor-pointer" />
        </div>

        {/* Tengah - Fitur */}
        <div className="min-w-[200px]">
          <p className="font-bold mb-1">Nikmati Keuntungan Reusemart</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Penjualan Barang Bekas</li>
            <li>Sistem Penitipan</li>
            <li>Reward Poin</li>
          </ul>

          <p className="font-bold mt-4 mb-1">Ikuti Kami</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Linkedin</li>
          </ul>
        </div>

        {/* Kanan - Download */}
        <div className="flex flex-col items-center">
          <p className="font-bold mb-2">Download Aplikasi Kami</p>
          <img src={qrImage} alt="QR Code ReuseMart Mobile" className="w-28 h-28 rounded" />
        </div>
      </div>

      {/* Footer Bawah */}
      <div className="bg-[#FFF7E2]">
        <p className="text-center text-sm text-[#2D4C41] py-3">
          ReuseMart @ 2025 - Radit - Tedja - Noveno
        </p>
      </div>
    </footer>
  );
}
