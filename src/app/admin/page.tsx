'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { pusherClient } from '@/lib/pusher';
import { OrderCard } from '@/components/admin/OrderCard';
import { IOrder } from '@/lib/models/order';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, ShoppingBag, Gamepad2, MonitorPlay, History, BookOpenCheck } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';
import { cn } from '@/lib/utils';

type RentalUnit = {
  id: string;
  name: string;
  console: string;
  status: 'Tersedia' | 'Digunakan';
};

const unitSetup = {
  vip: [
    { id: 'vip-1', name: 'VIP 01', console: 'PS4 + Netflix', status: 'Tersedia' as const },
    { id: 'vip-2', name: 'VIP 02', console: 'PS5 + Netflix', status: 'Tersedia' as const },
    { id: 'vip-3', name: 'VIP 03', console: 'PS5 + Netflix', status: 'Tersedia' as const },
  ],
  private: Array.from({ length: 6 }, (_, i) => ({
    id: `private-${i + 1}`,
    name: `Private ${i + 1}`,
    console: 'PS4',
    status: 'Tersedia' as const,
  })),
  regular: Array.from({ length: 6 }, (_, i) => ({
    id: `regular-${i + 1}`,
    name: `Regular ${i + 1}`,
    console: 'PS4',
    status: 'Tersedia' as const,
  })),
};

const initialUnits: RentalUnit[] = [...unitSetup.vip, ...unitSetup.private, ...unitSetup.regular];

function AdminPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [units, setUnits] = useState<RentalUnit[]>(initialUnits);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio('/music/notification.mp3');
    const enableAudio = () => { hasInteracted.current = true; window.removeEventListener('click', enableAudio); window.removeEventListener('keydown', enableAudio); };
    window.addEventListener('click', enableAudio);
    window.addEventListener('keydown', enableAudio);
    return () => { window.removeEventListener('click', enableAudio); window.removeEventListener('keydown', enableAudio); };
  }, []);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Gagal mengambil data pesanan awal');
        const data: IOrder[] = await response.json();
        setOrders(data);
      } catch (error) { console.error(error); }
    };
    fetchActiveOrders();
  }, []);

  // --- DIUBAH: Menggabungkan semua listener Pusher dalam satu useEffect --- 
  useEffect(() => {
    // --- Listener untuk Notifikasi Pesanan ---
    const playNotificationSound = () => {
      if (hasInteracted.current) { audioRef.current?.play().catch(console.error); }
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3500);
    };
    const handleNewOrder = (newOrder: IOrder) => { if (!newOrder?._id) return; setOrders(prev => [newOrder, ...prev.filter(o => o._id !== newOrder._id)]); playNotificationSound(); };
    const handleOrderStatusUpdate = (updatedOrder: IOrder) => { if (!updatedOrder?._id) return; const isFinished = updatedOrder.status === 'completed' || updatedOrder.status === 'cancelled'; if (isFinished) { setOrders(prev => prev.filter(order => order._id !== updatedOrder._id)); } else { setOrders(prev => prev.map(order => order._id === updatedOrder._id ? updatedOrder : order)); } };
    
    const orderChannel = pusherClient.subscribe('orders');
    orderChannel.bind('new-order', handleNewOrder);
    orderChannel.bind('status-update', handleOrderStatusUpdate);

    // --- Listener untuk Status Unit Real-time ---
    const unitChannel = pusherClient.subscribe('unit-status');
    const handleUnitStatusUpdate = ({ id, newStatus }: { id: string; newStatus: 'Tersedia' | 'Digunakan' }) => {
        setUnits(prev => prev.map(u => String(u.id) === id ? { ...u, status: newStatus } : u));
    };
    unitChannel.bind('status-update', handleUnitStatusUpdate);

    return () => {
      orderChannel.unbind_all();
      pusherClient.unsubscribe('orders');
      unitChannel.unbind_all();
      pusherClient.unsubscribe('unit-status');
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: IOrder['status']) => {
    try { await fetch(`/api/orders/${orderId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }), }); } catch (error) { console.error('Gagal memperbarui status pesanan:', error); }
  };

  // --- DIUBAH: Fungsi ini sekarang memanggil API untuk menyiarkan perubahan ---
  const toggleUnitStatus = async (unitId: string, currentStatus: 'Tersedia' | 'Digunakan') => {
    const newStatus = currentStatus === 'Tersedia' ? 'Digunakan' : 'Tersedia';
    try {
      await fetch(`/api/units/${unitId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('Gagal memperbarui status unit:', error);
    }
  };

  const renderUnitGroup = (title: string, unitsToRender: RentalUnit[]) => (
      <div key={title}>
          <h3 className="text-xl font-bold tracking-tight mb-3 text-primary">{title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {unitsToRender.map(unit => (
                  <Card key={unit.id} className={cn("text-center transition-all", unit.status === 'Tersedia' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30')}>
                      <CardHeader className="p-3 pb-1">
                          <CardTitle className="text-base">{unit.name}</CardTitle>
                          <CardDescription className="text-xs">{unit.console}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                          <p className={cn("font-bold mb-2 text-sm", unit.status === 'Tersedia' ? 'text-green-400' : 'text-red-400')}>{unit.status}</p>
                          {/* --- DIUBAH: Mengirim status saat ini ke fungsi toggle --- */}
                          <Button onClick={() => toggleUnitStatus(unit.id, unit.status)} size="sm" variant='secondary' className='w-full h-8 text-xs'>
                              {unit.status === 'Tersedia' ? 'Mulai Sesi' : 'Akhiri Sesi'}
                          </Button>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 space-y-12">
        <div className="flex justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-left">Admin Only</h1>
            <div className='flex items-center gap-2'>
              {showNotification && <BellRing className="h-7 w-7 text-primary animate-shake" />}
              <Link href="/admin/dashboard" passHref><Button variant="outline" size="sm" className="flex items-center gap-2"><BookOpenCheck size={14} /><span className='hidden sm:inline'>Data Booking</span></Button></Link>
              <Link href="/history" passHref><Button variant="outline" size="sm" className="flex items-center gap-2"><History size={14} /><span className='hidden sm:inline'>Riwayat Pesanan</span></Button></Link>
            </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><MonitorPlay size={24}/> Manajemen Status Unit</h2>
          <div className="space-y-6">
              {renderUnitGroup('VIP', units.filter(u => String(u.id).startsWith('vip')))}
              {renderUnitGroup('Private', units.filter(u => String(u.id).startsWith('private')))}
              {renderUnitGroup('Regular', units.filter(u => String(u.id).startsWith('regular')))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><Gamepad2 size={24}/> Pesanan Aktif</h2>
          {orders.length === 0 ? (
              <Card className='text-center border-dashed'><CardContent className='p-12'><ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" /><p className='mt-4 text-muted-foreground'>Belum ada pesanan aktif.</p></CardContent></Card>
          ) : (
              <div className="space-y-4">{orders.map((order) => (<OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />))}</div>
          )}
        </div>
    </div>
  );
}

export default withAuth(AdminPage);
