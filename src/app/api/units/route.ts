// src/app/api/units/route.ts
// API terpusat untuk mengelola status semua unit.

import { NextResponse } from 'next/server';
import { getAllUnitStatuses, updateUnitStatus } from '@/lib/unit-store';
import { pusherServer } from '@/lib/pusher';

/**
 * Handler untuk metode GET.
 * Mengembalikan status terbaru dari semua unit.
 * Ini dipanggil oleh klien saat pertama kali memuat halaman.
 */
export async function GET() {
    try {
        const statuses = getAllUnitStatuses();
        return NextResponse.json(statuses);
    } catch (error) {
        console.error('[API /units GET] Error:', error);
        return new NextResponse('Kesalahan Internal Server', { status: 500 });
    }
}

/**
 * Handler untuk metode POST.
 * Menerima pembaruan status dari halaman admin, memperbarui store,
 * dan menyiarkan perubahan ke semua klien melalui Pusher.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, status, remainingTime } = body;

        if (!id || !status || remainingTime === undefined) {
            return new NextResponse('Data tidak lengkap', { status: 400 });
        }

        // 1. Perbarui status di pusat data (server-side store)
        const updatedUnit = updateUnitStatus(id, status, remainingTime);

        if (!updatedUnit) {
            return new NextResponse(`Unit dengan ID ${id} tidak ditemukan`, { status: 404 });
        }

        // 2. Siarkan pembaruan ke semua klien yang terhubung melalui Pusher
        await pusherServer.trigger('unit-status', 'status-update', updatedUnit);

        console.log(`[API /units POST] Berhasil menyiarkan pembaruan untuk unit ${id}`);

        return NextResponse.json(updatedUnit);
    } catch (error) {
        console.error('[API /units POST] Error:', error);
        return new NextResponse('Kesalahan Internal Server', { status: 500 });
    }
}
