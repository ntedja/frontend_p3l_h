import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MitraReuseMartPage = () => {
  useEffect(() => {
    document.title = 'Mitra ReuseMart';
  }, []);

  return (
    <main className="bg-[#FFF7E2] text-[#2F3F3A]">
      <Header />

      {/* Hero */}
      <section className="text-center py-24 px-6 sm:px-10 lg:px-20">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold text-[#2F3F3A] mb-4"
        >
          Bergabung sebagai <span className="text-[#3E5B50]">Mitra ReuseMart</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base sm:text-lg max-w-3xl mx-auto text-[#405C53]"
        >
          Ada dua cara untuk berkontribusi dalam ekonomi sirkular bersama ReuseMart: sebagai{' '}
          <strong>Penitip Barang</strong> atau sebagai <strong>Mitra Jemput Bola</strong>. Kedua
          peran hanya bisa didaftarkan secara langsung di lokasi ReuseMart.
        </motion.p>
      </section>

      {/* Dua Peran Mitra */}
      <section className="bg-[#F3EFDA] py-20 px-6 sm:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Penitip */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-[#E1DBC0]"
          >
            <h3 className="text-xl font-bold text-[#3E5B50] mb-4">Mitra Penitip Barang</h3>
            <p className="text-sm text-[#2F3F3A] mb-4">
              Penitip adalah individu yang ingin menjual barang bekasnya melalui sistem ReuseMart.
              Barang akan dititipkan di gudang kami dan dipasarkan oleh tim kami.
            </p>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>Komisi 20% untuk masa penitipan pertama (30 hari)</li>
              <li>Komisi naik jadi 30% jika diperpanjang (30 hari tambahan)</li>
              <li>Jika tidak laku & tidak diambil dalam 7 hari, barang didonasikan</li>
              <li>Terdapat sistem notifikasi sebelum masa habis</li>
              <li>Pendaftaran dilakukan langsung di lokasi ReuseMart dengan membawa identitas</li>
            </ul>
          </motion.div>

          {/* Jemput Bola */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-[#E1DBC0]"
          >
            <h3 className="text-xl font-bold text-[#3E5B50] mb-4">Mitra Jemput Bola</h3>
            <p className="text-sm text-[#2F3F3A] mb-4">
              Mitra yang secara aktif mencari dan mengumpulkan barang layak pakai dari lingkungan
              sekitar. Barang yang dikumpulkan akan diproses di ReuseMart.
            </p>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li>Komisi 5% dari barang yang berhasil dijual</li>
              <li>Khusus untuk barang hasil jemput bola, komisi ReuseMart 15%</li>
              <li>Jika diperpanjang, ReuseMart ambil 25%</li>
              <li>Mitra dapat melihat laporan penjualan & komisinya</li>
              <li>Pendaftaran hanya bisa dilakukan secara langsung di kantor ReuseMart</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Ketentuan & Proses */}
      <section className="py-20 px-6 sm:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <h4 className="text-lg font-semibold text-[#3E5B50] mb-2">Syarat Umum Mitra</h4>
            <ul className="list-disc list-inside text-sm text-[#2F3F3A] space-y-2">
              <li>Memiliki KTP dan nomor kontak yang valid</li>
              <li>Untuk penitip, wajib membawa barang ke gudang</li>
              <li>Untuk mitra jemput bola, perlu validasi data barang dan identitas pengirim</li>
              <li>Semua barang akan melalui proses QC oleh staf gudang</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <h4 className="text-lg font-semibold text-[#3E5B50] mb-2">Alur Pendaftaran Mitra</h4>
            <p className="text-sm text-[#2F3F3A] mb-2">
              Semua pendaftaran dilakukan langsung di kantor ReuseMart. Mitra wajib membawa
              identitas diri (KTP) dan barang yang akan dititipkan (jika sebagai Penitip).
            </p>
            <ol className="list-decimal list-inside text-sm text-[#2F3F3A] space-y-2">
              <li>Datang ke kantor ReuseMart dan registrasi ke Customer Service</li>
              <li>Verifikasi identitas dan pengelolaan akun oleh staf ReuseMart</li>
              <li>Barang akan diperiksa (QC) dan dicatat di sistem</li>
              <li>Mitra dapat memantau komisi dan status barang melalui sistem</li>
            </ol>
          </motion.div>
        </div>
      </section>

      {/* Lokasi ReuseMart */}
      <section className="text-center py-16 px-6 sm:px-10 lg:px-20 bg-[#F3EFDA]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-lg font-semibold text-[#2F3F3A] mb-4">
            Ingin menjadi bagian dari ReuseMart?
          </p>
          <p className="text-sm text-[#2F3F3A] mb-6">
            Silakan kunjungi kantor ReuseMart di Yogyakarta untuk mendaftar sebagai Penitip atau
            Hunter.
          </p>
          <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.4011525785095!2d110.37052827501553!3d-7.851362492165943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a579e6c7b2f61%3A0xa6cfa405a9430b5a!2sReuseMart%20Yogyakarta!5e0!3m2!1sen!2sid!4v1715483600000!5m2!1sen!2sid"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
};

export default MitraReuseMartPage;
