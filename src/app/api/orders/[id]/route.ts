
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order, { IOrder } from '@/lib/models/order';
import { pusherServer } from '@/lib/pusher';

// --- PUT: Memperbarui status pesanan ---
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    await dbConnect();
    const { status } = await request.json() as { status: IOrder['status'] };

    // Validasi status baru
    if (!['pending', 'cooking', 'completed', 'cancelled'].includes(status)) {
        return NextResponse.json({ message: 'Status tidak valid' }, { status: 400 });
    }

    // Cari dan perbarui pesanan
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Mengembalikan dokumen yang telah diperbarui
    ).populate('items.menuItem'); // Populate lagi untuk data yang konsisten

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // --- Picu pembaruan real-time melalui Pusher ---
    await pusherServer.trigger('orders', 'status-update', updatedOrder);

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
