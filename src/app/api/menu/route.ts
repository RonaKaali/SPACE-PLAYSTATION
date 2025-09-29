
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/lib/models/menuItem';

export async function GET() {
  try {
    await dbConnect(); // Hubungkan ke database

    // Ambil semua item menu dari database
    const menuItems = await MenuItem.find({});

    // Kirim data sebagai respons JSON
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Kirim respons error jika terjadi masalah
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
