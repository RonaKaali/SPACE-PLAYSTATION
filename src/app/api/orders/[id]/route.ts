
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/order';
import { pusherServer } from '@/lib/pusher';

// PATCH /api/orders/[id]
// Mengubah status pesanan
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ message: 'Status baru diperlukan.' }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Mengembalikan dokumen yang sudah diperbarui
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    // Memicu Pusher untuk memberi tahu semua klien tentang perubahan status
    // Kita akan kirim seluruh data pesanan yang sudah diperbarui
    await pusherServer.trigger('orders', 'status-update', updatedOrder);

    return NextResponse.json(
      { message: "Status pesanan berhasil diperbarui!", order: updatedOrder },
      { status: 200 }
    );

  } catch (error) {
    console.error(`Gagal memperbarui status pesanan ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan internal server';
    return NextResponse.json({ message: 'Gagal memperbarui status pesanan.', error: errorMessage }, { status: 500 });
  }
}
