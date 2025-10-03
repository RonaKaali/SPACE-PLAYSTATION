
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/lib/models/menuItem';
import { menuItems as staticMenuItems } from '@/lib/menu';

// Fungsi untuk sinkronisasi database
async function seedDatabase() {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    console.log('Database menu kosong, memulai proses seeding...');
    const formattedMenuItems = staticMenuItems.map(item => ({
      menuId: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      available: item.available,
      description: item.description || '',
    }));
    await MenuItem.insertMany(formattedMenuItems);
    console.log(`Berhasil memasukkan ${formattedMenuItems.length} menu baru.`);
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Jalankan logika sinkronisasi sebelum mengambil data
    await seedDatabase();

    const menuItems = await MenuItem.find({ available: true }).sort({ category: 1, name: 1 });
    return NextResponse.json(menuItems);

  } catch (error) {
    console.error('Gagal memproses permintaan menu:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan server internal';
    return NextResponse.json({ message: 'Gagal mengambil menu.', error: errorMessage }, { status: 500 });
  }
}
