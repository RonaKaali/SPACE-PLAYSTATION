
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/lib/models/booking';
import { unstable_noStore as noStore } from 'next/cache'; // DIUBAH: Import noStore

// GET /api/bookings
export async function GET() {
  noStore(); // DIUBAH: Nonaktifkan caching

  try {
    await dbConnect();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Gagal mengambil data booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan internal server';
    return NextResponse.json({ message: 'Gagal mengambil data booking.', error: errorMessage }, { status: 500 });
  }
}

// POST /api/bookings
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const bookingDataForDb = {
      name: body.name,
      phone: body.phoneNumber,
      unitType: body.service?.toLowerCase(), 
      console: body.console?.toUpperCase(), 
      bookingDate: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      totalPrice: body.totalPrice,
    };

    const newBooking = await Booking.create(bookingDataForDb);

    return NextResponse.json(
      { message: "Booking berhasil dibuat!", bookingId: newBooking._id }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Gagal membuat booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan internal server';
    return NextResponse.json({ message: 'Gagal membuat booking.', error: errorMessage }, { status: 500 });
  }
}
