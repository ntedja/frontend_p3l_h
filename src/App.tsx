import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoginPageOrganisasi from './pages/LoginPageOrganisasi';
import LoginPagePenitip from './pages/LoginPagePenitip';
import RegisterPageOrganisasi from './pages/RegisterPageOrganisasi';
import ProductDetailPage from './pages/ProductDetailPage';
import ScrollToTop from './components/ScrollToTop';
import TentangReuseMartPage from './pages/TentangReuseMartPage';
import MitraReuseMartPage from './pages/MitraReuseMartPage';
import MulaiJualanPage from './pages/MulaiJualanPage';
import ReuseMartCarePage from './pages/ReuseMartCarePage';
import ProfilePage from './pages/ProfilePage';
import ProfilePageLive from './pages/ProfilePageLive';
import AlamatPage from './pages/AlamatPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import KatalogRequest from './pages/KatalogRequest';
import HistoryRequest from './pages/HistoryRequest';
import RiwayatPesananPage from './pages/RiwayatPesananPage';
import CheckoutPage from './pages/CheckoutPage';
import KonfirmasiPesananPage from './pages/KonfirmasiPesananPage';
import PembayaranPage from './pages/PembayaranPage';
import CartPage from './pages/CartPage';
import RequestPage from './pages/RequestPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/produk/:id" element={<ProductDetailPage />} />
        <Route path="/tentang-reusemart" element={<TentangReuseMartPage />} />
        <Route path="/mitra-reusemart" element={<MitraReuseMartPage />} />
        {/* <Route path="/mulai-jualan" element={<MulaiJualanPage />} /> */}
        <Route path="/reusemart-care" element={<ReuseMartCarePage />} />
        {/* <Route path="/loginorganisasi" element={<LoginPageOrganisasi />} />/ */}
        {/* <Route path="/loginpenitip" element={<LoginPagePenitip />} /> */}
        <Route path="/registerorganisasi" element={<RegisterPageOrganisasi />} />
        {/* <Route path="/katalogrequest" element={<KatalogRequest />} /> */}
        <Route path="/historyrequest" element={<ProtectedRoute><HistoryRequest /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profilepagelive" element={<ProtectedRoute><ProfilePageLive /></ProtectedRoute>} />
        <Route path="/alamat" element={<ProtectedRoute><AlamatPage /></ProtectedRoute>} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
        <Route path="/riwayat-pesanan" element={<ProtectedRoute><RiwayatPesananPage /></ProtectedRoute>} />
        <Route path="/checkout/:id" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/konfirmasi-pesanan/:orderId" element={<ProtectedRoute><KonfirmasiPesananPage /></ProtectedRoute>} />
        <Route path="/pembayaran/:orderId" element={<ProtectedRoute><PembayaranPage /></ProtectedRoute>} />
        <Route path="/requestdonasi" element={<ProtectedRoute><RequestPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
