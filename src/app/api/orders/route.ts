
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/order';
import { pusherServer } from '@/lib/pusher';

// --- GET: Mengambil semua data pesanan AKTIF ---
export async function GET() {
  try {
    await dbConnect();
    // DIUBAH: Hanya mengambil pesanan yang statusnya BUKAN 'completed' atau 'cancelled'
    const orders = await Order.find({ 
      status: { $nin: ['completed', 'cancelled'] } 
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ Error fetching active orders:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// --- POST: Membuat pesanan baru ---
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log('📦  Received new order request:', JSON.stringify(body, null, 2));

    // Buat dan simpan pesanan baru
    const newOrder = new Order(body);
    await newOrder.save();
    console.log('💾  Order saved successfully to database with ID:', newOrder._id);

    // =======================================================
    // !! KRUSIAL: Memicu Pusher untuk notifikasi real-time !!
    // =======================================================
    console.log('📡  Triggering Pusher event for new-order...');
    await pusherServer.trigger('orders', 'new-order', newOrder);
    console.log('✅  Pusher event triggered successfully.');

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
