
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Peringatan: Ini adalah autentikasi sisi klien yang sangat mendasar.
    // Dalam aplikasi nyata, jangan pernah melakukan hardcode kredensial di sisi klien.
    // Autentikasi harus ditangani oleh backend yang aman.
    if (username === 'admin' && password === 'space1') {
      // Gunakan sessionStorage agar pengguna tetap login selama sesi tab browser.
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      router.replace('/admin'); // Gunakan replace agar halaman login tidak ada di riwayat browser
    } else {
      setError('Username atau password yang Anda masukkan salah.');
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <Card className="w-full max-w-sm shadow-lg animate-fade-in-down">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl">Akses Dasbor Admin</CardTitle>
            <CardDescription>
              Silakan masukkan kredensial Anda untuk melanjutkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='bg-background/70'
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-background/70'
              />
            </div>
            {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <ShieldAlert size={16} />
                    <span>{error}</span>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full flex items-center gap-2" type="submit">
              <LogIn size={16} />
              Masuk
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
