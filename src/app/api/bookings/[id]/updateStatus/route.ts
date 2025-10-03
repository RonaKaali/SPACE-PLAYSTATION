
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/lib/models/booking';
import { revalidatePath } from 'next/cache';

// PATCH /api/bookings/[id]/updateStatus
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const { paymentStatus } = await req.json();

    if (paymentStatus !== 'paid') {
      return NextResponse.json(
        { message: 'Status yang diperbolehkan hanya "paid".' },
        { status: 400 }
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: { paymentStatus: 'paid' } },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ message: 'Booking tidak ditemukan' }, { status: 404 });
    }

    // Revalidasi data di halaman dashboard admin
    revalidatePath('/admin/dashboard');

    return NextResponse.json(
      { message: 'Status booking berhasil diperbarui', booking: updatedBooking },
      { status: 200 }
    );

  } catch (error) {
    console.error('Gagal memperbarui status booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan server internal';
    return NextResponse.json({ message: 'Gagal memperbarui status booking', error: errorMessage }, { status: 500 });
  }
}
