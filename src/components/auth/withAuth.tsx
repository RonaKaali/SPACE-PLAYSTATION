
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Ini adalah Higher-Order Component (HOC) untuk melindungi halaman.
// Ia akan memeriksa apakah pengguna sudah terautentikasi di sisi klien.

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Pengecekan hanya terjadi di sisi klien (setelah komponen dimuat)
      const checkAuth = () => {
        const adminIsAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
        if (!adminIsAuthenticated) {
          router.replace('/login');
        } else {
          setIsAuthenticated(true);
        }
      };

      checkAuth();
    }, [router]);

    // Selama pengecekan, tampilkan loader agar tidak ada kedipan konten
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className='mt-4 text-muted-foreground'>Memverifikasi sesi Anda...</p>
        </div>
      );
    }

    // Jika sudah terautentikasi, tampilkan komponen halaman yang asli
    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
