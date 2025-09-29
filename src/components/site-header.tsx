
"use client";

import Link from "next/link";
import { Gamepad2, Menu, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function SiteHeader() {
    const [open, setOpen] = useState(false);
    const navLinks = [
        { href: "/", label: "Beranda" },
        { href: "/#konsol", label: "Konsol" },
        { href: "/availability", label: "Laporan Langsung" },
        { href: "/rekomendasi", label: "Rekomendasi AI" },
    ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              RentStation
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                    {link.label}
                </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
            <Button asChild variant="outline" className="hidden md:flex items-center gap-2">
                <Link href="/admin"><ShieldCheck size={16}/> Dasbor Admin</Link>
            </Button>
            <Button asChild className="hidden md:flex">
                <Link href="/#konsol">Sewa Sekarang</Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                    >
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                    <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                        <Gamepad2 className="mr-2 h-5 w-5 text-primary" />
                        <span className="font-bold font-headline">RentStation</span>
                    </Link>
                    <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                        <div className="flex flex-col space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-muted-foreground"
                                    onClick={() => setOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t">
                            <Link href="/admin" className="flex items-center text-foreground/70" onClick={() => setOpen(false)}>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                <span>Dasbor Admin</span>
                            </Link>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
