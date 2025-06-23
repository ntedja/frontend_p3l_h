import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ShieldCheck, Bell, DollarSign, HeartHandshake } from "lucide-react";

const ReuseMartCarePage = () => {
  useEffect(() => {
    document.title = "ReuseMart - Care";
  }, []);

  const steps = [
    {
      title: "1. Titipkan Barangmu",
      icon: <ShieldCheck className="w-6 h-6 text-[#3E5B50]" />,
      desc: "Bawa barang bekas ke gudang ReuseMart atau isi formulir penitipan online. Barang akan melalui proses QC sebelum ditampilkan."
    },
    {
      title: "2. Pantau Status",
      icon: <Bell className="w-6 h-6 text-[#3E5B50]" />,
      desc: "Gunakan notifikasi sistem untuk mengetahui apakah barangmu laku, diperpanjang, atau perlu diambil kembali."
    },
    {
      title: "3. Terima Komisi",
      icon: <DollarSign className="w-6 h-6 text-[#3E5B50]" />,
      desc: "Jika barangmu terjual, komisi akan langsung ditransfer ke rekening kamu tanpa perlu repot mengurus penjualan."
    },
    {
      title: "4. Barang Tak Terjual Didonasikan",
      icon: <HeartHandshake className="w-6 h-6 text-[#3E5B50]" />,
      desc: "Jika barang tidak diambil dalam 7 hari setelah masa penitipan, barang akan didonasikan ke mitra sosial ReuseMart."
    }
  ];

  return (
    <main className="bg-[#FFF7E2] text-[#2F3F3A]">
      <Header />

      <section className="text-center py-24 px-6 sm:px-10 lg:px-20">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4"
        >
          Layanan <span className="text-[#3E5B50]">ReuseMart Care</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base sm:text-lg max-w-2xl mx-auto text-[#405C53]"
        >
          Transparansi dan ketenangan pikiran dalam penitipan barang bekas. ReuseMart Care memastikan barangmu dikelola, dipantau, dan disalurkan secara adil.
        </motion.p>
      </section>

      {/* Prosedur Penitipan */}
      <section className="px-6 sm:px-10 lg:px-20 py-20 bg-[#F3EFDA]">
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
              className="bg-white p-6 rounded-2xl shadow border border-[#E1DBC0] text-center flex flex-col items-center"
            >
              <div className="mb-3">{step.icon}</div>
              <h3 className="font-semibold text-base text-[#3E5B50] mb-2">{step.title}</h3>
              <p className="text-sm text-[#2F3F3A] leading-relaxed text-left">{step.desc}</p>
            </motion.div>   
          ))}
        </div>
      </section>

      {/* Info Tambahan */}
      <section className="py-20 px-6 sm:px-10 lg:px-20 bg-[#FFF7E2]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-xl font-bold text-[#3E5B50] mb-8 text-center">Kenapa Butuh ReuseMart Care?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow border border-[#E1DBC0]">
              <h4 className="text-sm font-semibold text-[#3E5B50] mb-2">✔ Penitipan Aman & Transparan</h4>
              <p className="text-sm text-[#2F3F3A]">Semua proses penitipan dicatat dengan sistem dan dapat dipantau statusnya.</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow border border-[#E1DBC0]">
              <h4 className="text-sm font-semibold text-[#3E5B50] mb-2">✔ Pelacakan & Notifikasi Aktif</h4>
              <p className="text-sm text-[#2F3F3A]">Dapatkan update otomatis mengenai status barangmu setiap saat.</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow border border-[#E1DBC0]">
              <h4 className="text-sm font-semibold text-[#3E5B50] mb-2">✔ Donasi Barang Tak Terambil</h4>
              <p className="text-sm text-[#2F3F3A]">Barang yang tidak diambil akan disalurkan ke mitra sosial yang terpercaya.</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow border border-[#E1DBC0]">
              <h4 className="text-sm font-semibold text-[#3E5B50] mb-2">✔ Dukungan Tim CS</h4>
              <p className="text-sm text-[#2F3F3A]">Tim kami siap membantumu selama proses penitipan, dari awal hingga akhir.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Kontak */}
      <section className="bg-[#F3EFDA] text-center py-12 px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-base text-[#2F3F3A]"
        >
          Butuh bantuan? Hubungi ReuseMart di <strong>WhatsApp 0812-3456-7890</strong> atau datang langsung ke gudang kami di Yogyakarta.
        </motion.p>
      </section>

      <Footer />
    </main>
  );
};

export default ReuseMartCarePage;