
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Gamepad2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

const routes = [
  { href: '/', label: 'Beranda' },
  { href: '/availability', label: 'Laporan Langsung' },
  { href: '/menu', label: 'Menu Makanan' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Gamepad2 className="w-7 h-7 text-primary"/>
          <span className="font-headline">RentStation</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {routes.map(route => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === route.href ? 'text-primary' : 'text-muted-foreground'}`}>
              {route.label}
            </Link>
          ))}
        </nav>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button asChild variant="secondary">
            <Link href="/admin">Login Admin</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                {[...routes, {href: '/admin', label: 'Admin'}].map(route => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`flex items-center gap-4 px-2.5 ${pathname === route.href ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground`}>
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
