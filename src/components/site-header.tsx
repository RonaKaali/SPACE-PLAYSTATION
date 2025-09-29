
"use client";

import Link from "next/link";
import { Home, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <>
      {/* DIUBAH: Tombol diperkecil ukurannya */}
      <div className="absolute top-4 left-4 z-50">
        <Button size="sm" asChild variant="outline" className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm">
            <Link href="/"><Home size={14}/> Beranda</Link>
        </Button>
      </div>

      {/* DIUBAH: Tombol diperkecil ukurannya */}
      <div className="absolute top-4 right-4 z-50">
        <Button size="sm" asChild variant="outline" className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm">
            <Link href="/admin"><ShieldCheck size={14}/>Admin</Link>
        </Button>
      </div>
    </>
  );
}
