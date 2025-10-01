'use client';

import { useEffect, useState, useRef } from 'react';
import { pusherClient } from '@/lib/pusher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import RealTimeClock from '@/components/ui/real-time-clock';

// --- Tipe Data Konsisten ---
type RentalUnit = {
  id: string;
  name: string;
  console: 'ps4' | 'ps5';
  netflix: boolean;
  price1hr: number;
  price3hr: number;
  status: 'Tersedia' | 'Digunakan';
  remainingTime: number; // Data dari server
};

// --- Data Statis Unit (Nama, Harga, dll) ---
const unitSetup = {
  vip: [
    { id: 'vip-1', name: 'VIP 01', console: 'ps4', netflix: true, price1hr: 15000, price3hr: 40000 },
    { id: 'vip-2', name: 'VIP 02', console: 'ps5', netflix: true, price1hr: 20000, price3hr: 55000 },
    { id: 'vip-3', name: 'VIP 03', console: 'ps5', netflix: true, price1hr: 20000, price3hr: 55000 },
  ],
  private: Array.from({ length: 6 }, (_, i) => ({ id: `private-${i + 1}`, name: `Private ${i + 1}`, console: 'ps4', netflix: false, price1hr: 10000, price3hr: 25000 })),
  regular: Array.from({ length: 6 }, (_, i) => ({ id: `regular-${i + 1}`, name: `Regular ${i + 1}`, console: 'ps4', netflix: false, price1hr: 7000, price3hr: 20000 })),
};
const staticUnitDetails = [...unitSetup.vip, ...unitSetup.private, ...unitSetup.regular];

const LiveConditionPage = () => {
  const [units, setUnits] = useState<RentalUnit[]>([]);
  const [activeCategory, setActiveCategory] = useState('Private');
  const timerRefs = useRef<Record<string, NodeJS.Timeout>>({});

  // --- Helper untuk mengelola timer di sisi klien ---
  const manageClientTimer = (unit: RentalUnit) => {
    if (timerRefs.current[unit.id]) {
      clearInterval(timerRefs.current[unit.id]);
    }

    if (unit.status === 'Digunakan' && unit.remainingTime > 0) {
      timerRefs.current[unit.id] = setInterval(() => {
        setUnits(prevUnits => 
          prevUnits.map(u => 
            u.id === unit.id ? { ...u, remainingTime: Math.max(0, u.remainingTime - 1) } : u
          )
        );
      }, 1000);
    }
  };

  // --- EFEK 1: Mengambil Status Awal dari Server ---
  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        console.log("Mengambil status awal dari server...");
        const response = await fetch('/api/units');
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        const serverUnits: RentalUnit[] = await response.json();

        // Gabungkan data statis (nama, harga) dengan data dinamis dari server (status, waktu)
        const combinedUnits = staticUnitDetails.map(staticUnit => {
          const serverUnit = serverUnits.find(su => su.id === staticUnit.id) || { status: 'Tersedia', remainingTime: 0 };
          return { ...staticUnit, status: serverUnit.status, remainingTime: serverUnit.remainingTime };
        });

        setUnits(combinedUnits);
        console.log("Status awal berhasil dimuat:", combinedUnits);

        // Jalankan timer untuk semua unit yang sedang digunakan
        combinedUnits.forEach(unit => manageClientTimer(unit));

      } catch (error) {
        console.error("Error saat mengambil status awal:", error);
      }
    };

    fetchInitialStatus();

    // Cleanup semua timer saat komponen unmount
    return () => {
      Object.values(timerRefs.current).forEach(clearInterval);
    };
  }, []);

  // --- EFEK 2: Mendengarkan Pembaruan Real-time dari Pusher ---
  useEffect(() => {
    const channel = pusherClient.subscribe('unit-status');
    
    const handleStatusUpdate = (updatedUnitFromServer: RentalUnit) => {
      console.log("Menerima pembaruan dari Pusher:", updatedUnitFromServer);
      setUnits(prevUnits => 
        prevUnits.map(u => 
          u.id === updatedUnitFromServer.id 
            ? { ...u, status: updatedUnitFromServer.status, remainingTime: updatedUnitFromServer.remainingTime }
            : u
        )
      );
      // Update timer lokal berdasarkan data dari server
      manageClientTimer(updatedUnitFromServer);
    };

    channel.bind('status-update', handleStatusUpdate);

    return () => {
      channel.unbind('status-update', handleStatusUpdate);
      pusherClient.unsubscribe('unit-status');
    };
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getUnitsForCategory = () => {
    const categoryPrefix = activeCategory.toLowerCase();
    return units.filter(unit => unit.id.startsWith(categoryPrefix));
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline text-primary">Live Condition</h1>
            <div className="mt-2"><RealTimeClock /></div>
            <p className="mt-4 text-muted-foreground">Pilih kategori untuk melihat status ketersediaan tempat secara real-time.</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-secondary/50 p-1 rounded-lg flex gap-1">
            {['Regular', 'Private', 'VIP'].map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? 'primary' : 'ghost'}
                onClick={() => setActiveCategory(category)}
                className="px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-md"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {units.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getUnitsForCategory().map(unit => {
                const isRunning = unit.status === 'Digunakan';
                return (
                    <Card key={unit.id} className={cn("transition-all shadow-md", isRunning ? 'bg-red-900/40 border-red-500/50' : 'bg-secondary/50 border-primary/20')}>
                        <CardHeader className='p-4'>
                            <div className="flex justify-between items-center">
                                <CardTitle className='text-lg font-bold'>{unit.name}</CardTitle>
                                {isRunning && unit.remainingTime > 0 ? (
                                    <div className="font-mono text-xl font-bold text-red-400 tracking-tight">{formatTime(unit.remainingTime)}</div>
                                ) : (
                                    <div className="text-lg font-bold text-green-400">Tersedia</div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className='p-4 pt-0'>
                            <div className="flex justify-between text-muted-foreground text-sm">
                                <div className='flex flex-col gap-1'>
                                    <p>1 Jam: Rp {unit.price1hr.toLocaleString('id-ID')}</p>
                                    <p>3 Jam: Rp {unit.price3hr.toLocaleString('id-ID')}</p>
                                </div>
                                <div className='flex flex-col items-end gap-1'>
                                    <div className={cn(`flex items-center gap-1.5 font-semibold`, unit.console === 'ps5' ? 'text-blue-400' : 'text-gray-300')}>
                                        <Gamepad2 size={16} />
                                        <span>{unit.console.toUpperCase()}</span>
                                    </div>
                                    {unit.netflix && (
                                        <div className="flex items-center gap-1.5 font-semibold text-red-500">
                                            <Film size={16} />
                                            <span>Netflix</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
          </div>
        ) : (
            <p className='text-center text-muted-foreground'>Memuat status ketersediaan unit...</p>
        )}

      </main>
        <footer className="bg-gray-900/50 text-white py-6 mt-12">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-sm font-semibold">&copy; 2025 SPACE PLAYSTATION. Semua Hak Cipta Dilindungi.</p>
                    <p className="text-xs text-gray-400">Dibangun oleh <span className="font-bold text-primary">ALEXANDER RONA</span></p>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default LiveConditionPage;
