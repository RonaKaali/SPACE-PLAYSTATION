
// src/scripts/seed.ts
import dbConnect from '../lib/mongodb';
import MenuItem from '../lib/models/menuItem';
import { menuItems as staticMenuItems } from '../lib/menu'; // Data statis kita

const seedMenuItems = async () => {
  try {
    await dbConnect();
    console.log('Terhubung ke database.');

    // Hapus data lama untuk menghindari duplikasi
    await MenuItem.deleteMany({});
    console.log('Data menu lama berhasil dihapus.');

    // Masukkan data baru dari file statis
    await MenuItem.insertMany(staticMenuItems);
    console.log('Data menu baru berhasil ditanam (seeded) ke database.');

  } catch (error) {
    console.error('Error saat melakukan seeding database:', error);
  } finally {
    // Tutup koneksi setelah selesai
    process.exit(0);
  }
};

seedMenuItems();
