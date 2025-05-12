import { motion } from "framer-motion";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TentangReuseMartPage() {
  useEffect(() => {
    document.title = "Tentang ReuseMart";
  }, []);

  return (
    <main className="bg-[#FFF7E2] text-[#2F3F3A] min-h-screen w-full overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#FFF7E2] text-center py-24 px-6 sm:px-10 lg:px-20 w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-[#2F3F3A]"
        >
          Mewujudkan Ekonomi Sirkular Bersama <br />
          <span className="text-[#3E5B50]">ReuseMart</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-[#405C53]"
        >
          Platform jual beli barang bekas berkualitas dari Yogyakarta. Berdiri atas kepedulian lingkungan,
          ReuseMart hadir sebagai solusi ramah lingkungan dan praktis.
        </motion.p>
      </section>

      {/* About Section */}
      <section className="bg-[#F3EFDA] py-20 border-t border-[#FFF7E2] w-full">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md mx-auto">
              <img
                src="src/assets/ecoFriendly.png"
                alt="Eco Friendly Illustration"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-sm sm:text-base"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F3F3A]">Apa Itu ReuseMart?</h2>
            <p>
              ReuseMart adalah marketplace barang bekas yang menggabungkan proses konsinyasi,
              manajemen gudang, pengiriman, dan donasi barang dalam satu platform digital.
              Semua proses dilakukan oleh tim kami, sehingga penitip cukup menitipkan barang
              dan kami yang akan bekerja.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Barang tidak laku bisa didonasikan secara transparan</li>
              <li>Kurir internal dan gudang di Yogyakarta</li>
              <li>Komisi jelas: 20% reguler, 30% jika diperpanjang</li>
              <li>Dukungan sistem notifikasi dan pelacakan status barang</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="py-20 w-full bg-[#FFF7E2]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-center mb-10 text-[#2F3F3A]"
          >
            Mengapa ReuseMart Istimewa?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Layanan Konsinyasi All-in-One",
                desc: "Dari QC, foto produk, gudang, hingga pengiriman ditangani oleh tim profesional kami."
              },
              {
                title: "Komitmen Ramah Lingkungan",
                desc: "Mengurangi limbah dan mendukung daur ulang melalui donasi barang yang tidak laku."
              },
              {
                title: "Platform Digital Transparan",
                desc: "Transaksi dan status barang bisa dilihat secara real-time oleh penitip dan pembeli."
              },
              {
                title: "Mitra Sosial untuk Donasi",
                desc: "Barang yang tak terjual dapat disumbangkan ke organisasi sosial yang terverifikasi."
              },
              {
                title: "Dukungan Layanan Pelanggan",
                desc: "Tim kami siap membantu penitip dan pembeli melalui sistem terintegrasi."
              },
              {
                title: "Sistem Notifikasi Cerdas",
                desc: "Pengingat otomatis saat masa penitipan hampir habis atau saat barang harus diambil."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="bg-[#F3EFDA] p-6 rounded-xl shadow-md text-center"
              >
                <h3 className="font-semibold text-base sm:text-lg text-[#3E5B50] mb-2">{item.title}</h3>
                <p className="text-sm text-[#2F3F3A]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Home CTA */}
      <div className="text-center py-12">
        <a
          href="/"
          className="inline-block bg-[#3E5B50] text-white px-6 py-3 rounded-lg shadow hover:bg-[#2F3F3A] transition"
        >
          Kembali ke Beranda
        </a>
      </div>

      <Footer />
    </main>
  );
}
