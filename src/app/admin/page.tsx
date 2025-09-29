
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link'; // Impor Link untuk navigasi
import { useRouter } from 'next/navigation';
import { pusherClient } from '@/lib/pusher';
import { OrderCard } from '@/components/admin/OrderCard';
import { IOrder } from '@/lib/models/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, ShoppingBag, LogOut, Gamepad2, MonitorPlay, History } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';
import { cn } from '@/lib/utils';

type RentalUnit = {
  id: number;
  name: string;
  status: 'Tersedia' | 'Digunakan';
};

const initialUnits: RentalUnit[] = [
  { id: 1, name: 'VIP 1', status: 'Tersedia' },
  { id: 2, name: 'VIP 2', status: 'Tersedia' },
  { id: 3, name: 'Regular 1', status: 'Tersedia' },
  { id: 4, name: 'Regular 2', status: 'Tersedia' },
  { id: 5, name: 'Regular 3', status: 'Tersedia' },
];

function AdminPage() {
  // KEMBALI HANYA MENGGUNAKAN SATU STATE untuk pesanan aktif
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();
  const [units, setUnits] = useState<RentalUnit[]>(initialUnits);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef(false);
  const pusherSubscribed = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio('/music/notification.mp3');
    const enableAudio = () => {
      hasInteracted.current = true;
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
    window.addEventListener('click', enableAudio);
    window.addEventListener('keydown', enableAudio);
    return () => {
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
  }, []);

  // KEMBALI HANYA MENGAMBIL PESANAN AKTIF
  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Gagal mengambil data pesanan awal');
        const data: IOrder[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchActiveOrders();
  }, []);

  useEffect(() => {
    if (pusherSubscribed.current) return;
    pusherSubscribed.current = true;

    const playNotificationSound = () => {
      if (hasInteracted.current) {
        audioRef.current?.play().catch(console.error);
      }
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3500);
    };

    const handleNewOrder = (newOrder: IOrder) => {
      if (!newOrder?._id) return;
      setOrders(prev => [newOrder, ...prev.filter(o => o._id !== newOrder._id)]);
      playNotificationSound();
    };

    // LOGIKA UPDATE DISEDERHANAKAN: Hapus jika selesai, atau update jika status lain
    const handleStatusUpdate = (updatedOrder: IOrder) => {
        if (!updatedOrder?._id) return;
        const isFinished = updatedOrder.status === 'completed' || updatedOrder.status === 'cancelled';
        if (isFinished) {
            setOrders(prev => prev.filter(order => order._id !== updatedOrder._id));
        } else {
            setOrders(prev => prev.map(order => order._id === updatedOrder._id ? updatedOrder : order));
        }
    };

    const channel = pusherClient.subscribe('orders');
    channel.bind('new-order', handleNewOrder);
    channel.bind('status-update', handleStatusUpdate);

    return () => {
      channel.unbind('new-order', handleNewOrder);
      channel.unbind('status-update', handleStatusUpdate);
      pusherClient.unsubscribe('orders');
      pusherSubscribed.current = false;
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: IOrder['status']) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('Gagal memperbarui status:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.replace('/login');
  };

  const toggleUnitStatus = (unitId: number) => {
    setUnits(units.map(u => u.id === unitId ? { ...u, status: u.status === 'Tersedia' ? 'Digunakan' : 'Tersedia' } : u));
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 space-y-12">
        <div className="flex justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-left">Admin Only</h1>
            <div className='flex items-center gap-2'>
              {showNotification && <BellRing className="h-7 w-7 text-primary animate-shake" />}
              
              {/* --- TOMBOL BARU KE HALAMAN RIWAYAT --- */}
              <Link href="/history" passHref>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <History size={14} />
                    <span className='hidden sm:inline'>Riwayat Pesanan</span>
                  </Button>
              </Link>

              <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center gap-2">
                <LogOut size={14} />
                <span className='hidden sm:inline'>Logout</span>
              </Button>
            </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><MonitorPlay size={24}/> Manajemen Status Unit</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {units.map(unit => (
              <Card key={unit.id} className={cn("text-center transition-all", unit.status === 'Tersedia' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30')}>
                <CardHeader className="p-4"><CardTitle className="text-lg">{unit.name}</CardTitle></CardHeader>
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

        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><Gamepad2 size={24}/> Pesanan Aktif</h2>
          {orders.length === 0 ? (
              <Card className='text-center border-dashed'>
                  <CardContent className='p-12'>
                      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className='mt-4 text-muted-foreground'>Belum ada pesanan aktif.</p>
                  </CardContent>
              </Card>
          ) : (
              <div className="space-y-4">
                  {orders.map((order) => (
                      <OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />
                  ))}
              </div>
          )}
        </div>
    </div>
  );
}

export default withAuth(AdminPage);
