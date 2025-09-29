
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IOrder } from '@/lib/models/order';
import { OrderCard } from '@/components/admin/OrderCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, ArrowLeft } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';

function HistoryPage() {
  const [historyOrders, setHistoryOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/orders/history');
        if (!response.ok) {
          throw new Error('Gagal mengambil riwayat pesanan');
        }
        const data: IOrder[] = await response.json();
        setHistoryOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Fungsi dummy karena OrderCard memerlukannya, tapi di sini tidak ada aksi
  const handleDummyStatusChange = () => {};

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 space-y-8">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline flex items-center gap-3">
          <History size={32}/>
          Riwayat Pesanan
        </h1>
        <Link href="/admin" passHref>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={14} />
            Kembali ke Dasbor
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className='text-center text-muted-foreground'>Memuat riwayat...</p>
      ) : historyOrders.length === 0 ? (
        <Card className='text-center border-dashed'>
          <CardContent className='p-12'>
            <p className='mt-4 text-muted-foreground'>Belum ada riwayat pesanan yang selesai atau dibatalkan.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {historyOrders.map((order) => (
            // Menggunakan kembali OrderCard, status tidak bisa diubah
            <OrderCard key={order._id} order={order} onStatusChange={handleDummyStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(HistoryPage);
