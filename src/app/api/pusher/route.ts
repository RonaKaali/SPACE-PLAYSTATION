
import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';

// Nama channel dan event untuk pesanan
const ORDER_CHANNEL = 'orders';
const NEW_ORDER_EVENT = 'new-order';

/**
 * Endpoint API untuk menerima pesanan baru dari klien dan menyiarkannya
 * melalui Pusher ke semua klien yang mendengarkan (dalam hal ini, panel admin).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Data yang diharapkan dari body request
    const { unit, items, total } = body;

    // Validasi data sederhana
    if (!unit || !items || !total) {
      return new NextResponse('Data tidak valid', { status: 400 });
    }

    // Memicu event Pusher di sisi server
    // Ini akan mengirim data ke semua klien yang subscribe ke channel 'orders'
    await pusherServer.trigger(ORDER_CHANNEL, NEW_ORDER_EVENT, {
      id: new Date().getTime(), // ID unik sederhana berdasarkan waktu
      unit,
      items,
      total,
      time: new Date().toISOString(), // Waktu pesanan dalam format standar
    });

    return new NextResponse('Pesanan berhasil dikirim', { status: 200 });

  } catch (error) {
    console.error('Pusher API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
