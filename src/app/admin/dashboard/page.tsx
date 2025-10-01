
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/order';
import HistoryClientPage from './HistoryClientPage'; // Komponen sisi klien
import { unstable_noStore as noStore } from 'next/cache';

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

async function getCompletedOrders(): Promise<CompletedOrder[]> {
  noStore();
  try {
    await dbConnect();

    const completedOrders = await Order.find({ status: 'completed' })
                                       .sort({ updatedAt: -1 })
                                       .lean();

    const sanitizedOrders: CompletedOrder[] = completedOrders.map(order => ({
      _id: order._id.toString(),
      unit: order.unit,
      totalAmount: order.totalAmount,
      status: order.status as 'completed',
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map(item => ({
        name: item.name || 'N/A',
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    return sanitizedOrders;
  } catch (error) {
    console.error("Data Fetching Error - Gagal mengambil riwayat pesanan:", error);
    return [];
  }
}

export default async function HistoryPage() {
  const initialOrders = await getCompletedOrders();
  return <HistoryClientPage initialOrders={initialOrders} />;
}
