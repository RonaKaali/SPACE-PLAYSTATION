
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/order';
import MenuItem from '@/lib/models/menuItem';
import { pusherServer } from '@/lib/pusher';

export async function GET() {
  try {
    await dbConnect();
    // Populate menuItem details when fetching orders
    const activeOrders = await Order.find({ 
      status: { $nin: ['completed', 'cancelled'] } 
    })
    .populate({ path: 'items.menuItem', model: MenuItem })
    .sort({ createdAt: -1 });
    return NextResponse.json(activeOrders);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Kesalahan Server Internal';
    return NextResponse.json({ message: 'Gagal mengambil pesanan.', error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { items, total, unit } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !total || !unit) {
      return NextResponse.json({ message: 'Data pesanan tidak lengkap.' }, { status: 400 });
    }

    const itemMenuIds = items.map(item => item.id);
    const menuItemsFromDb = await MenuItem.find({ menuId: { $in: itemMenuIds } }).lean();

    const idToObjectIdMap = menuItemsFromDb.reduce((acc, item) => {
      acc[item.menuId] = item._id;
      return acc;
    }, {} as Record<string, any>);

    const transformedItems = items.map(item => {
      const objectId = idToObjectIdMap[item.id];
      if (!objectId) {
        throw new Error(`Item menu dengan menuId "${item.id}" tidak ditemukan.`);
      }
      // Kita tidak lagi perlu menyimpan `name` di sini karena akan di-populate
      return {
        menuItem: objectId,
        quantity: item.quantity,
        price: item.price,
      };
    });

    let newOrder = await Order.create({
      unit,
      items: transformedItems,
      totalAmount: total,
      status: 'pending',
    });

    // --- PERBAIKAN KRUSIAL: POPULATE SEBELUM MENGIRIM KE PUSHER ---
    // Ambil kembali dokumen yang baru dibuat dan populate field menuItem
    const populatedOrder = await Order.findById(newOrder._id).populate({
      path: 'items.menuItem',
      model: MenuItem,
    });

    // Kirim objek yang sudah di-populate ke Pusher
    await pusherServer.trigger('orders', 'new-order', populatedOrder);
    // --- AKHIR PERBAIKAN ---

    return NextResponse.json(
      { message: "Pesanan berhasil dibuat!", order: populatedOrder },
      { status: 201 }
    );

  } catch (error) {
    console.error('Gagal membuat pesanan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan internal server';
    return NextResponse.json({ message: 'Gagal membuat pesanan.', error: errorMessage }, { status: 500 });
  }
}
