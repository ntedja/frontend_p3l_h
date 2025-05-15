import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ScrollToTop from "./components/ScrollToTop";
import TentangReuseMartPage from "./pages/TentangReuseMartPage";
import MitraReuseMartPage from "./pages/MitraReuseMartPage";
import MulaiJualanPage from "./pages/MulaiJualanPage";
import ReuseMartCarePage from "./pages/ReuseMartCarePage";

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
        <Route path="/mulai-jualan" element={<MulaiJualanPage />} />
        <Route path="/reusemart-care" element={<ReuseMartCarePage />} />
      </Routes>
    </BrowserRouter>
  );
}
