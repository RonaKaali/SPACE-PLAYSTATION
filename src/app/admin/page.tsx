
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pusherClient } from '@/lib/pusher';
import { OrderCard, Order } from '@/components/admin/OrderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, ShoppingBag, LogOut, Gamepad2, MonitorPlay } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';
import { cn } from '@/lib/utils';

// Definisikan tipe data untuk Unit Rental
type RentalUnit = {
  id: number;
  name: string;
  status: 'Tersedia' | 'Digunakan';
};

// Data awal untuk unit rental (nantinya bisa diambil dari database)
const initialUnits: RentalUnit[] = [
  { id: 1, name: 'VIP 1', status: 'Tersedia' },
  { id: 2, name: 'VIP 2', status: 'Tersedia' },
  { id: 3, name: 'Regular 1', status: 'Tersedia' },
  { id: 4, name: 'Regular 2', status: 'Tersedia' },
  { id: 5, name: 'Regular 3', status: 'Tersedia' },
];

function AdminPage() {
  // State untuk pesanan dan notifikasi
  const [orders, setOrders] = useState<Order[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  // State untuk unit rental
  const [units, setUnits] = useState<RentalUnit[]>(initialUnits);

  // Fungsi Logout
  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.replace('/login');
  };

  // Fungsi untuk mengubah status unit
  const toggleUnitStatus = (unitId: number) => {
    setUnits(units.map(unit => 
      unit.id === unitId
        ? { ...unit, status: unit.status === 'Tersedia' ? 'Digunakan' : 'Tersedia' }
        : unit
    ));
  };

  // Efek untuk menangani pesanan real-time dari Pusher
  useEffect(() => {
    const playNotificationSound = () => {
      const audio = new Audio('/music/notification.mp3');
      audio.play().catch(error => console.error("Error playing sound:", error));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const channel = pusherClient.subscribe('orders');
    channel.bind('new-order', (data: Order) => {
      setOrders(prevOrders => [data, ...prevOrders]);
      playNotificationSound();
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe('orders');
    };
  }, []);

  // Fungsi untuk menandai pesanan selesai
  const handleMarkAsDone = (orderId: number) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 space-y-12">
        {/* Header Dasbor */}
        <div className="flex justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-left">
                Dasbor Admin
            </h1>
            <div className='flex items-center gap-2'>
              {showNotification && <BellRing className="h-7 w-7 text-primary animate-shake" />}
              <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center gap-2">
                <LogOut size={14} />
                <span className='hidden sm:inline'>Logout</span>
              </Button>
            </div>
        </div>

        {/* Bagian Manajemen Unit */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><MonitorPlay size={24}/> Manajemen Status Unit</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {units.map((unit) => (
              <Card key={unit.id} className={cn("text-center transition-all", unit.status === 'Tersedia' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30')}>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{unit.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className={cn("font-bold mb-3", unit.status === 'Tersedia' ? 'text-green-400' : 'text-red-400')}>{unit.status}</p>
                    <Button onClick={() => toggleUnitStatus(unit.id)} size="sm" variant='secondary' className='w-full'>
                      {unit.status === 'Tersedia' ? 'Mulai Sesi' : 'Akhiri Sesi'}
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bagian Pesanan Makanan */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><Gamepad2 size={24}/> Pesanan Makanan Langsung</h2>
          {orders.length === 0 ? (
              <Card className='text-center border-dashed'>
                  <CardContent className='p-12'>
                      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className='mt-4 text-muted-foreground'>Belum ada pesanan yang masuk.</p>
                  </CardContent>
              </Card>
          ) : (
              <div className="space-y-4">
                  {orders.map((order) => (
                      <OrderCard key={order.id} order={order} onDone={handleMarkAsDone} />
                  ))}
              </div>
          )}
        </div>
    </div>
  );
}

export default withAuth(AdminPage);
