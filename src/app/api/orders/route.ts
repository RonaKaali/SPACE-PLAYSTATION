
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/order';
import { pusherServer } from '@/lib/pusher';

// GET /api/orders
export async function GET() {
  try {
    await dbConnect();
    const activeOrders = await Order.find({ 
      status: { $nin: ['completed', 'cancelled'] } 
    })
    .populate('items.menuItem') // Populate menuItem details
    .sort({ createdAt: -1 });
    return NextResponse.json(activeOrders);
  } catch (error) {
    console.error('Gagal mengambil pesanan aktif:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan internal server';
    return NextResponse.json({ message: 'Gagal mengambil pesanan.', error: errorMessage }, { status: 500 });
  }
}

// POST /api/orders
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    // Ambil `total` dan `items` dari body
    const { items, total, unit } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !total || !unit) {
      return NextResponse.json({ message: 'Data pesanan tidak lengkap atau tidak valid.' }, { status: 400 });
    }

    // ---- PERBAIKAN: Transformasi data agar sesuai dengan Skema Mongoose ----
    const transformedItems = items.map(item => ({
      menuItem: item.id, // Gunakan item.id sebagai referensi ke menuItem
      quantity: item.quantity,
      price: item.price,
    }));

    const newOrderPayload = {
      unit,
      items: transformedItems, 
      totalAmount: total, // Map `total` ke `totalAmount`
      status: 'pending',
    };
    // ----------------------------------------------------------------------

    const newOrder = await Order.create(newOrderPayload);

    await pusherServer.trigger('orders', 'new-order', newOrder);

    return NextResponse.json(
      { message: "Pesanan berhasil dibuat!", order: newOrder },
      { status: 201 }
    );

  } catch (error) {
    console.error('Gagal membuat pesanan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan internal server';
    return NextResponse.json({ message: 'Gagal membuat pesanan.', error: errorMessage }, { status: 500 });
  }
}
