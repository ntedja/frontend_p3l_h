export type UserRole = 'pembeli' | 'organisasi' | 'pegawai' | 'penitip' | null;

export const FILAMENT_DASHBOARD_BASE_URL = 'https://reusemart.site';

export const getDashboardPathForRole = (role: UserRole): string | null => {
  if (role === 'pegawai') {
    const jabatan = localStorage.getItem('jabatan');
    if (jabatan && (jabatan.toLowerCase() === 'owner' || jabatan.toLowerCase() === 'admin')) {
      return '/admin';
    }
  }

  if (!role) return null;

  switch (role) {
    case 'pembeli':
      return '/pembeli';
    case 'organisasi':
      return '/organisasi';
    case 'penitip':
      return '/penitip';
    case 'pegawai':
      return '/pegawai';
    default:
      console.warn('Unhandled role for dashboard path:', role);
      return null;
  }
};
