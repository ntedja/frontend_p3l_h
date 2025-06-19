import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logoImage from '../assets/logo.png';
import axios from 'axios';
import { loginOrganisasi, loginPenitip, getErrorMessage, setAuthToken } from '../api/apiAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // For registration success message
  const [loginRequiredModal, setLoginRequiredModal] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });
  // const [userType, setUserType] = useState<'customer_staff' | 'organization'>(() => {
  //   const state = location.state as { userType?: 'customer_staff' | 'organization' };
  //   return state?.userType || 'customer_staff';
  // });

  useEffect(() => {
    const state = location.state as {
      // userType?: 'customer_staff' | 'organization'; // No longer used for selection
      registrationSuccess?: boolean;
      email?: string;
      loginRequiredMessage?: string; // To display messages from other pages
    };
    // if (state?.userType) { // No longer used for selection
    //   setUserType(state.userType);
    // }
    if (state?.registrationSuccess && state?.email) {
      setEmail(state.email);
      setSuccessMsg(`Registrasi berhasil! Silakan login.`);
      // Clear the state from history to prevent re-triggering and message persisting on refresh
      navigate(location.pathname, { replace: true, state: {} }); // Use location.pathname
    } else if (state?.loginRequiredMessage) {
      setLoginRequiredModal({ show: true, message: state.loginRequiredMessage });
      navigate(location.pathname, { replace: true, state: {} }); // Clear the message
    }
  }, [location.state, navigate, location.pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg(''); // Clear success message on new login attempt
    let loggedIn = false;
    // let specificError = ''; // To store the last specific error if needed for debugging

    // Attempt 1: Login as Pembeli/Pegawai
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email, // The backend for /api/login expects 'email'
        password: password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('email', email);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setAuthToken(res.data.token); // Explicitly update the shared api instance's auth header

      if (res.data.role === 'pegawai') {
        localStorage.setItem('jabatan', res.data.jabatan);
      }
      console.log('Login berhasil sebagai:', res.data.role);
      console.log('Nama:', res.data.user.NAMA_PEMBELI || res.data.user.NAMA_PEGAWAI);
      console.log('Email:', email);
      console.log('Token:', res.data.token);

      navigate('/');
      loggedIn = true;
    } catch (pembeliPegawaiError: any) {
      // specificError = pembeliPegawaiError.response?.data?.message || 'Gagal login sebagai pelanggan/pegawai.';
      console.warn(
        'Pembeli/Pegawai login failed:',
        pembeliPegawaiError.response?.data?.message || pembeliPegawaiError.message,
      );
    }

    // Attempt 2: Login as Organisasi
    if (!loggedIn) {
      try {
        const apiResponse = await loginOrganisasi({
          EMAIL_ORGANISASI: email,
          PASSWORD_ORGANISASI: password,
        });
        localStorage.setItem('role', 'organisasi');
        localStorage.setItem('email', email);
        // loginOrganisasi handles setting 'token' and 'user' in localStorage
        const orgUser = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Login berhasil sebagai: organisasi');
        console.log('Nama Organisasi:', orgUser.NAMA_ORGANISASI);
        console.log('Email Organisasi:', email);
        console.log('Token:', localStorage.getItem('token'));

        navigate('/');
        loggedIn = true;
      } catch (organisasiError: any) {
        // specificError = getErrorMessage(organisasiError as any) || 'Gagal login sebagai organisasi.';
        console.warn(
          'Organisasi login failed:',
          getErrorMessage(organisasiError as any) || organisasiError.message,
        );
      }
    }

    // Attempt 3: Login as Penitip
    if (!loggedIn) {
      try {
        const penitipResponse = await loginPenitip({
          EMAIL_PENITIP: email,
          PASSWORD_PENITIP: password,
        });
        localStorage.setItem('role', 'penitip');
        localStorage.setItem('email', email);
        // loginPenitip handles setting 'token' and 'user' in localStorage
        const penitipUser = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Login berhasil sebagai: penitip');
        console.log('Nama Penitip:', penitipUser.NAMA_PENITIP);
        console.log('Email Penitip:', email);
        console.log('Token:', localStorage.getItem('token'));

        navigate('/'); // Or penitip-specific dashboard
        loggedIn = true;
      } catch (penitipError: any) {
        // specificError = getErrorMessage(penitipError as any) || 'Gagal login sebagai penitip.';
        console.warn(
          'Penitip login failed:',
          getErrorMessage(penitipError as any) || penitipError.message,
        );
      }
    }

    if (!loggedIn) {
      setErrorMsg('Login gagal. Email atau password salah, atau akun tidak ditemukan.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7E2] text-[#1E2B32] flex flex-col">
      {/* Header */}
      <div className="bg-white py-7 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-2xl font-bold text-[#48635B] cursor-pointer"
          >
            <img src={logoImage} alt="Logo" className="w-17 h-10" />
          </div>
          <h1 className="text-2xl font-semibold text-black">Log in</h1>
        </div>
      </div>

      {/* Konten */}
      <div className="flex-1 bg-[#FFF7E2] flex items-center justify-center px-4">
        <div className="max-w-6xl w-full flex flex-col md:flex-row justify-between items-center gap-14 py-16">
          {/* Kiri */}
          <div className="text-center md:text-left flex-1">
            <img src={logoImage} alt="ReuseMart Logo" className="w-80 h-70 mx-auto md:mx-0" />
            <h1 className="text-[#48635B] text-xl md:text-2xl font-bold mt-6">
              Jual Beli Barang Bekas di ReuseMart
            </h1>
            <p className="text-base mt-4 text-[#405C53] max-w-md mx-auto md:mx-0">
              Gabung dan rasakan kemudahan bertransaksi di ReuseMart, platform konsinyasi barang
              bekas terpercaya.
            </p>
          </div>

          {/* Form Login */}
          <div className="bg-white rounded-2xl border border-[#E1DBC0] shadow-md p-10 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-2 text-[#3E5B50]">Login Akun</h2>
            {/* <p className="text-sm text-center mb-6 text-gray-600">
              Masuk sebagai {userType === 'customer_staff' ? 'Pelanggan/Pegawai' : 'Organisasi'} // Removed
            </p>
            <p className="text-sm text-center mb-6 text-gray-600">Silakan masukkan email dan password Anda.</p>

            {/* <div className="flex justify-center space-x-4 mb-5"> // Radio buttons removed
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="customer_staff"
                  checked={userType === 'customer_staff'}
                  onChange={() => setUserType('customer_staff')}
                  className="form-radio text-[#3E5B50] focus:ring-[#3E5B50]"
                />
                <span className="text-sm">Pelanggan/Pegawai</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="organization"
                  checked={userType === 'organization'}
                  onChange={() => setUserType('organization')}
                  className="form-radio text-[#3E5B50] focus:ring-[#3E5B50]"
                />
                <span className="text-sm">Organisasi</span>
              </label>
            </div> */}

            <form className="space-y-5" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm"
              />
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-[#CFCAB5] bg-white text-[#2F3F3A] rounded-lg px-4 py-2.5 text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E5B50]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end mt-2">
                  <a href="/forgot-password" className="text-sm text-[#3E5B50] hover:underline">
                    Lupa password?
                  </a>
                </div>
              </div>

              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
              {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}

              <button
                type="submit"
                className="w-full bg-[#3E5B50] hover:bg-[#2D4C41] text-white py-3 rounded-full shadow-md text-sm"
              >
                Log In
              </button>
            </form>

            <p className="text-sm text-center mt-6 text-[#2F3F3A]">
              Belum punya akun?{' '}
              <a href={'/register'} className="text-[#3E5B50] font-semibold hover:underline">
                Daftar
              </a>
              {' / '}
              <a
                href={'/registerorganisasi'}
                className="text-[#3E5B50] font-semibold hover:underline"
              >
                Daftar Organisasi
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      {loginRequiredModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md text-center">
            <h3 className="text-xl font-semibold text-[#3E5B50] mb-4">Perhatian</h3>
            <p className="text-gray-700 mb-6">{loginRequiredModal.message}</p>
            <button
              onClick={() => setLoginRequiredModal({ show: false, message: '' })}
              className="w-full bg-[#3E5B50] hover:bg-[#2D4C41] text-white py-2.5 rounded-lg shadow-md text-sm font-semibold transition-colors duration-150"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-white py-11" />
    </div>
  );
}
