
import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// ====================================================================
// !! PENTING: GANTI DENGAN KUNCI PUSHER ANDA SENDIRI !!
// ====================================================================
// 1. Buat akun gratis di https://pusher.com
// 2. Buat "Channel" baru di dashboard Pusher.
// 3. Ambil App Keys Anda dan masukkan di bawah ini.
// 4. Pastikan Anda juga mengisi `NEXT_PUBLIC_PUSHER_KEY` dan `NEXT_PUBLIC_PUSHER_CLUSTER`
//    di file .env.local (buat jika belum ada).
// ====================================================================

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,      // Ganti dengan 'appId' Anda
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!, // Ganti dengan 'key' Anda
  secret: process.env.PUSHER_SECRET!,    // Ganti dengan 'secret' Anda
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!, // Ganti dengan 'cluster' Anda (mis: 'ap1')
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!, // Ganti dengan 'key' Anda
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!, // Ganti dengan 'cluster' Anda
  }
);
