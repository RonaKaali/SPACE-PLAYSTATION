
import { GetServerSideProps } from 'next';
import dbConnect from '@/lib/mongodb';
import Order, { IOrder } from '@/lib/models/order';
import HistoryClientPage from './HistoryClientPage'; // Komponen sisi klien

export type CompletedOrder = {
  _id: string;
  unit: string;
  totalAmount: number;
  status: 'completed';
  createdAt: string; 
  updatedAt: string; 
  items: { 
    name: string; 
    quantity: number; 
    price: number; 
  }[];
};

type HistoryPageProps = {
  initialOrders: CompletedOrder[];
};

export default function HistoryPage({ initialOrders }: HistoryPageProps) {
  return <HistoryClientPage initialOrders={initialOrders} />;
}

// --- Pengambilan Data di Sisi Server (SSR) ---
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    await dbConnect();

    // Hanya ambil pesanan yang sudah selesai dan urutkan dari yang terbaru
    const completedOrders = await Order.find({ status: 'completed' })
                                       .sort({ updatedAt: -1 })
                                       .lean(); // .lean() untuk objek JS murni & performa

    // Konversi data agar aman untuk dikirim ke komponen client
    const sanitizedOrders: CompletedOrder[] = completedOrders.map(order => ({
      _id: order._id.toString(),
      unit: order.unit,
      totalAmount: order.totalAmount,
      status: order.status as 'completed',
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map(item => ({
        name: item.name || 'N/A', // Pastikan ada nama
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    return {
      props: {
        initialOrders: sanitizedOrders,
      },
    };
  } catch (error) {
    console.error("SSR Error - Gagal mengambil riwayat pesanan:", error);
    return {
      props: {
        initialOrders: [], // Kirim array kosong jika terjadi error
      },
    };
  }
};
