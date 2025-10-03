
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/order';
import MenuItem from '@/lib/models/menuItem'; // Import MenuItem model
import { pusherServer } from '@/lib/pusher';

// PATCH /api/orders/[id] -> Mengubah status pesanan
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
      { new: true } 
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    // --- PERBAIKAN: Populate data item sebelum mengirim ke Pusher ---
    const populatedOrder = await Order.findById(updatedOrder._id).populate({
        path: 'items.menuItem',
        model: MenuItem
    });
    // --- AKHIR PERBAIKAN ---

    // Memicu Pusher untuk memberi tahu semua klien tentang perubahan status
    // Kirim data yang sudah di-populate
    await pusherServer.trigger('orders', 'status-update', populatedOrder);

    return NextResponse.json(
      { message: "Status pesanan berhasil diperbarui!", order: populatedOrder },
      { status: 200 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan internal server';
    return NextResponse.json({ message: 'Gagal memperbarui status pesanan.', error: errorMessage }, { status: 500 });
  }
}
