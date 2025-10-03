'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { pusherClient } from '@/lib/pusher';
import { OrderCard } from '@/components/admin/OrderCard';
import { IOrder } from '@/lib/models/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, ShoppingBag, Gamepad2, MonitorPlay, History, BookOpenCheck, Film } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';
import { cn } from '@/lib/utils';
import RealTimeClock from '@/components/ui/real-time-clock';
import { SessionDialog } from '@/components/ui/session-dialog';

// Tipe Data yang Konsisten
type RentalUnit = {
  id: string;
  name: string;
  console: 'ps4' | 'ps5';
  netflix: boolean;
  price1hr: number;
  price3hr: number;
  status: 'Tersedia' | 'Digunakan';
  remainingTime: number;
};

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

function AdminPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [units, setUnits] = useState<RentalUnit[]>([]);
  const [isSessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const manageTimer = (unit: RentalUnit) => {
    if (timerRefs.current[unit.id]) clearInterval(timerRefs.current[unit.id]);
    if (unit.status === 'Digunakan' && unit.remainingTime > 0) {
      timerRefs.current[unit.id] = setInterval(() => {
        setUnits(prev => prev.map(u => 
          u.id === unit.id ? { ...u, remainingTime: Math.max(0, u.remainingTime - 1) } : u
        ));
      }, 1000);
    } 
  };

  useEffect(() => {
    audioRef.current = new Audio('/music/notification.mp3');
    const fetchInitialUnitStatus = async () => {
      try {
        const res = await fetch('/api/units');
        const serverUnits: RentalUnit[] = await res.json();
        const combinedUnits = staticUnitDetails.map(staticUnit => ({ ...staticUnit, ...serverUnits.find(su => su.id === staticUnit.id) }));
        setUnits(combinedUnits);
        combinedUnits.forEach(manageTimer);
      } catch (error) { console.error("Gagal mengambil status unit:", error); }
    };
    const fetchInitialOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Gagal memuat pesanan');
        setOrders(await res.json());
      } catch (error) { console.error("Gagal mengambil pesanan awal:", error); }
    };
    fetchInitialUnitStatus();
    fetchInitialOrders();
    return () => Object.values(timerRefs.current).forEach(clearInterval);
  }, []);

  // --- EFEK PUSHER DENGAN FUNGSI PEMBERSIHAN ---
  useEffect(() => {
    const orderChannel = pusherClient.subscribe('orders');
    const unitChannel = pusherClient.subscribe('unit-status');
    const playSound = () => { 
        audioRef.current?.play().catch(e => console.log(e)); // Lebih baik log errornya
        setShowNotification(true); 
        setTimeout(() => setShowNotification(false), 3500); 
    };

    const handleNewOrder = (newOrder: IOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      playSound();
    };

    const handleStatusUpdate = (updatedOrder: IOrder) => {
      if (updatedOrder.status === 'completed' || updatedOrder.status === 'cancelled') {
        setOrders(prev => prev.filter(o => o._id !== updatedOrder._id));
      } else {
        setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
      }
    };

    const handleUnitUpdate = (updatedUnit: RentalUnit) => {
      setUnits(prev => prev.map(u => u.id === updatedUnit.id ? { ...u, ...updatedUnit } : u));
      manageTimer(updatedUnit);
    };

    orderChannel.bind('new-order', handleNewOrder);
    orderChannel.bind('status-update', handleStatusUpdate);
    unitChannel.bind('status-update', handleUnitUpdate);

    // --- PERBAIKAN KRUSIAL: Membersihkan listener untuk mencegah duplikasi ---
    return () => {
      orderChannel.unbind_all();
      unitChannel.unbind_all();
      pusherClient.unsubscribe('orders');
      pusherClient.unsubscribe('unit-status');
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: IOrder['status']) => {
    try {
      await fetch(`/api/orders/${orderId}`,
       {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Gagal memperbarui status pesanan:", error);
    }
  };

  const broadcastStatusChange = async (unitId: string, newStatus: 'Tersedia' | 'Digunakan', remainingTime: number = 0) => {
    try {
      await fetch('/api/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: unitId, status: newStatus, remainingTime }),
      });
    } catch (error) { console.error('Gagal menyiarkan status unit:', error); }
  };

  const handleStartSession = (durationInMinutes: number) => {
    if (!selectedUnitId) return;
    broadcastStatusChange(selectedUnitId, 'Digunakan', durationInMinutes * 60);
    setSessionDialogOpen(false);
  };

  const handleEndSession = (unitId: string) => {
    broadcastStatusChange(unitId, 'Tersedia', 0);
  };

  const openSessionDialog = (unitId: string) => {
    setSelectedUnitId(unitId);
    setSessionDialogOpen(true);
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const renderUnitGroup = (title: string, unitsToRender: RentalUnit[]) => (
    <div key={title}>
      <h3 className="text-xl font-bold tracking-tight mb-4 text-primary">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {unitsToRender.map(unit => {
          const isRunning = unit.status === 'Digunakan';
          return (
            <Card key={unit.id} className={cn("flex flex-col transition-all shadow-md", isRunning ? 'bg-red-900/40 border-red-500/50' : 'bg-secondary/50 border-primary/20')}>
              <CardHeader className='p-4 pb-3'>
                <div className="flex justify-between items-center gap-4">
                  <CardTitle className='text-lg font-bold'>{unit.name}</CardTitle>
                  {isRunning && unit.remainingTime > 0 ? (
                    <div className="font-mono text-xl font-bold text-red-400 tracking-tight whitespace-nowrap">{formatTime(unit.remainingTime)}</div>
                  ) : (
                    <div className="text-lg font-bold text-green-400 whitespace-nowrap">Tersedia</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                <div className="flex justify-between items-end text-muted-foreground text-sm mb-4">
                  <div className='flex flex-col gap-1.5'>
                    <p>1 Jam: Rp {unit.price1hr.toLocaleString('id-ID')}</p>
                    <p>3 Jam: Rp {unit.price3hr.toLocaleString('id-ID')}</p>
                  </div>
                  <div className='flex flex-col items-end gap-1.5'>
                    <div className={cn(`flex items-center gap-1.5 font-semibold`, unit.console === 'ps5' ? 'text-blue-400' : 'text-gray-300')}>
                      <Gamepad2 size={16} />
                      <span>{unit.console.toUpperCase()}</span>
                    </div>
                    {unit.netflix && (
                      <div className="flex items-center gap-1.5 font-semibold text-red-500"><Film size={16} /><span>Netflix</span></div>
                    )}
                  </div>
                </div>
                <Button onClick={() => isRunning ? handleEndSession(unit.id) : openSessionDialog(unit.id)} size="sm" className='w-full h-9 text-sm font-bold' variant={isRunning ? 'destructive' : 'default'}>
                  {isRunning ? 'Akhiri Sesi' : 'Mulai Sesi'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
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
      <RealTimeClock />
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><MonitorPlay size={24}/> Manajemen Status Unit</h2>
        <div className="space-y-8">
          {units.length > 0 ? (
            <>
              {renderUnitGroup('VIP', units.filter(u => u.id.startsWith('vip')))}
              {renderUnitGroup('Private', units.filter(u => u.id.startsWith('private')))}
              {renderUnitGroup('Regular', units.filter(u => u.id.startsWith('regular')))}
            </>
          ) : (
            <p className='text-center text-muted-foreground'>Memuat status unit...</p>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><ShoppingBag size={24}/> Pesanan Aktif</h2>
        {orders.length === 0 ? (
          <Card className='text-center border-dashed'><CardContent className='p-12'><ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" /><p className='mt-4 text-muted-foreground'>Belum ada pesanan aktif.</p></CardContent></Card>
        ) : (
          <div className="space-y-4">{orders.map((order) => (<OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />))}</div>
        )}
      </div>
      <SessionDialog open={isSessionDialogOpen} onOpenChange={setSessionDialogOpen} onStartSession={handleStartSession} />
    </div>
  );
}

export default withAuth(AdminPage);
