
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/order';

// --- GET: Mengambil semua riwayat pesanan (selesai/dibatalkan) ---
export async function GET() {
  try {
    await dbConnect();
    
    // Mengambil pesanan yang statusnya 'completed' atau 'cancelled'
    const orders = await Order.find({ 
      status: { $in: ['completed', 'cancelled'] } 
    }).sort({ updatedAt: -1 }); // Diurutkan berdasarkan kapan terakhir di-update
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ Error fetching completed orders:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
