
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/order';
import MenuItem from '@/lib/models/menuItem'; // Import MenuItem model

// --- GET: Mengambil semua riwayat pesanan (selesai/dibatalkan) ---
export async function GET() {
  try {
    await dbConnect();
    
    // --- PERBAIKAN: Menambahkan populate untuk mengambil detail item ---
    const orders = await Order.find({ 
      status: { $in: ['completed', 'cancelled'] } 
    })
    .populate({ path: 'items.menuItem', model: MenuItem }) // Populate item details
    .sort({ updatedAt: -1 }); // Diurutkan berdasarkan kapan terakhir di-update
    // --- AKHIR PERBAIKAN ---
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ Gagal mengambil riwayat pesanan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Kesalahan Server Internal';
    return NextResponse.json({ message: 'Gagal mengambil riwayat pesanan', error: errorMessage }, { status: 500 });
  }
}
