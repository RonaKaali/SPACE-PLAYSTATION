
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/order';
import Booking, { IBooking } from '@/lib/models/booking';
import HistoryClientPage from './HistoryClientPage'; // Komponen sisi klien
import { unstable_noStore as noStore } from 'next/cache';
import MenuItem, { IMenuItem } from '@/lib/models/menuItem';

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

export type BookingData = Omit<IBooking, 'createdAt' | 'updatedAt'> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

async function getCompletedOrders(): Promise<CompletedOrder[]> {
  noStore();
  MenuItem.findOne(); 

  try {
    await dbConnect();
    const completedOrders = await Order.find({ status: 'completed' })
                                       .populate<{ items: { menuItem: IMenuItem }[] }>('items.menuItem')
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
        name: item.menuItem?.name || 'Item Dihapus',
        quantity: item.quantity,
        price: item.menuItem?.price || 0,
      })),
    }));

    return sanitizedOrders;
  } catch (error) {
    console.error("Data Fetching Error - Gagal mengambil riwayat pesanan:", error);
    return [];
  }
}

async function getBookings(): Promise<BookingData[]> {
  noStore();
  try {
    await dbConnect();
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    
    // DIUBAH: Pastikan paymentStatus selalu ada, default ke 'unpaid' untuk data lama
    return bookings.map(booking => ({
      ...(booking as Omit<IBooking, 'createdAt' | 'updatedAt'>),
      _id: booking._id.toString(),
      // Beri nilai default 'unpaid' jika tidak ada
      paymentStatus: booking.paymentStatus || 'unpaid', 
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

  } catch (error) {
    console.error("Data Fetching Error - Gagal mengambil data booking:", error);
    return [];
  }
}


export default async function HistoryPage() {
  const initialOrders = await getCompletedOrders();
  const initialBookings = await getBookings();
  return <HistoryClientPage initialOrders={initialOrders} initialBookings={initialBookings} />;
}
