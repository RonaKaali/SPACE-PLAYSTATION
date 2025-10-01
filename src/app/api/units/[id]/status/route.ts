import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status: newStatus, remainingTime } = await req.json();

    if (!newStatus || !id) {
      return new NextResponse("Data tidak lengkap", { status: 400 });
    }

    // Memicu event ke Pusher
    await pusherServer.trigger("unit-status", "status-update", {
      id,
      newStatus,
      remainingTime, // Sertakan sisa waktu
    });

    return new NextResponse("Status berhasil diperbarui dan disiarkan", {
      status: 200,
    });
  } catch (error) {
    console.error("Error saat memperbarui status unit:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan internal";
    return new NextResponse(errorMessage, { status: 500 });
  }
}
