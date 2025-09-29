
import { NextResponse } from 'next/server';
import { database } from '@/lib/firebase';
import { ref, push, set, get } from "firebase/database";

// Handler untuk membuat booking baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phoneNumber, service, console, date, startTime, endTime, duration, totalPrice } = body;

    // Validasi input dasar
    if (!name || !phoneNumber || !service || !console || !date || !startTime || !endTime) {
      return NextResponse.json({ message: 'Data yang dikirim tidak lengkap' }, { status: 400 });
    }

    const bookingsRef = ref(database, 'bookings');
    const newBookingRef = push(bookingsRef);

    await set(newBookingRef, {
        ...body,
        bookingId: newBookingRef.key,
        createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Booking berhasil dibuat", bookingId: newBookingRef.key }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}

// Handler untuk mengambil data booking
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date'); // YYYY-MM-DD

        const bookingsRef = ref(database, 'bookings');
        const snapshot = await get(bookingsRef);

        if (snapshot.exists()) {
            const allBookings = snapshot.val();
            let bookingsArray = Object.values(allBookings);

            // Filter berdasarkan tanggal jika ada query param
            if (date) {
                bookingsArray = bookingsArray.filter((booking: any) => booking.date.startsWith(date));
            }
            
            return NextResponse.json(bookingsArray, { status: 200 });
        } else {
            return NextResponse.json([], { status: 200 }); // Kembalikan array kosong jika tidak ada data
        }
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
    }
}
