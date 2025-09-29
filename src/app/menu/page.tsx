
'use client';

import { useState } from 'react';
import { menuItems, MenuItem } from '@/lib/menu';
import { rentalSpaces } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // DIIMPOR: Hook untuk menampilkan notifikasi toast

const generateAllUnits = () => {
  let units: { id: string; name: string }[] = [];
  rentalSpaces.forEach(space => {
    if (space.units > 1) {
      for (let i = 1; i <= space.units; i++) {
        units.push({ id: `${space.id}-${i}`, name: `${space.name} ${i}` });
      }
    } else {
      units.push({ id: space.id, name: space.name });
    }
  });
  return units;
};

type CartItem = {
    item: MenuItem;
    quantity: number;
}

export default function MenuPage() {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // DIINISIASI: Fungsi toast untuk digunakan
  const allUnits = generateAllUnits();

  const addToCart = (item: MenuItem) => {
    if (!item.available) return;
    setCart(prevCart => {
        const existingItem = prevCart[item.id];
        if (existingItem) {
            return { ...prevCart, [item.id]: { ...existingItem, quantity: existingItem.quantity + 1 } };
        } else {
            return { ...prevCart, [item.id]: { item, quantity: 1 } };
        }
    });
  };

  const decreaseQuantity = (itemId: string) => {
    setCart(prevCart => {
        const existingItem = prevCart[itemId];
        if (existingItem && existingItem.quantity > 1) {
            return { ...prevCart, [itemId]: { ...existingItem, quantity: existingItem.quantity - 1 } };
        } else {
            const newCart = { ...prevCart };
            delete newCart[itemId];
            return newCart;
        }
    });
  };

  const cartAsArray = Object.values(cart);
  const total = cartAsArray.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);

  const handleOrder = async () => {
    // DIPERBARUI: Menggunakan toast untuk validasi
    if (!selectedUnit) {
      toast({
        variant: "destructive",
        title: "Unit Belum Dipilih",
        description: "Silakan pilih unit atau tempat Anda bermain terlebih dahulu.",
      });
      return;
    }
    if (cartAsArray.length === 0) {
      toast({
        variant: "destructive",
        title: "Keranjang Kosong",
        description: "Tambahkan item ke keranjang sebelum membuat pesanan.",
      });
      return;
    }

    setIsLoading(true);
    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                unit: selectedUnit,
                items: cartAsArray.map(ci => ({ menuItem: ci.item.id, quantity: ci.quantity })),
                totalAmount: total,
                status: 'pending'
            }),
        });

        if (res.ok) {
            // DIPERBARUI: Notifikasi sukses menggunakan toast
            toast({
                title: "Pesanan Berhasil Terkirim!",
                description: "Silakan tunggu, pesanan Anda sedang disiapkan.",
            });
            setCart({});
            setSelectedUnit(''); // Mengosongkan pilihan unit juga
        } else {
            const errorData = await res.json();
            // DIPERBARUI: Notifikasi error menggunakan toast
            toast({
                variant: "destructive",
                title: "Gagal Membuat Pesanan",
                description: errorData.message || 'Terjadi kesalahan pada server. Coba lagi.',
            });
        }
    } catch (error) {
        console.error('Failed to submit order:', error);
        // DIPERBARUI: Notifikasi error koneksi menggunakan toast
        toast({
            variant: "destructive",
            title: "Koneksi Gagal",
            description: "Terjadi kesalahan. Periksa koneksi Anda dan coba lagi.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold tracking-tight text-center sm:text-4xl font-headline">Menu Makanan & Minuman</h1>
        <p className="mt-4 text-center text-muted-foreground">Pesan langsung dari tempat bermain Anda.</p>

        <div className="mt-8">
            <Select onValueChange={setSelectedUnit} value={selectedUnit} disabled={isLoading}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Unit/Tempat Anda Bermain" /></SelectTrigger>
                <SelectContent>{allUnits.map(unit => <SelectItem key={unit.id} value={unit.name}>{unit.name}</SelectItem>)}</SelectContent>
            </Select>
        </div>

        <div className="mt-8 space-y-6">
          {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold tracking-tight font-headline mb-4">{category}</h2>
              <div className="grid grid-cols-1 gap-4">
                {items.map(item => (
                  <Card key={item.id} className={`bg-secondary/50 ${!item.available ? 'opacity-50' : ''}`}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <Button size="icon" onClick={() => addToCart(item)} disabled={!item.available || isLoading}>
                        {item.available ? <Plus size={16}/> : 'Habis'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {cartAsArray.length > 0 && (
            <Card className="mt-8 sticky bottom-4 border-2 border-primary shadow-lg">
                <CardHeader className='p-4'><CardTitle className='flex items-center gap-2'><ShoppingCart size={20}/>Keranjang Anda</CardTitle></CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-4 text-sm">
                        {cartAsArray.map(({item, quantity}) => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <span>{item.name}</span>
                                    <p className='text-xs text-muted-foreground'>Rp {(item.price * quantity).toLocaleString('id-ID')}</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Button size='icon' variant='outline' className='h-7 w-7' onClick={() => decreaseQuantity(item.id)} disabled={isLoading}><Minus size={14}/></Button>
                                    <span>{quantity}</span>
                                    <Button size='icon' variant='outline' className='h-7 w-7' onClick={() => addToCart(item)} disabled={isLoading}><Plus size={14}/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t my-4"></div>
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span>Rp {total.toLocaleString('id-ID')}</span></div>
                    <Button className="w-full mt-4" onClick={handleOrder} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Mengirim Pesanan...' : 'Pesan Sekarang (Bayar di Tempat)'}
                    </Button>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
