'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { menuItems, MenuItem } from '@/lib/menu';
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';

interface CartItem extends MenuItem {
  quantity: number;
}

// Sesuaikan dengan data yang diterima dari /api/units
interface Unit {
  id: string;
  // name dan category mungkin tidak ada, jadi buat opsional
  name?: string;
  category?: string;
}

export default function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch('/api/units');
        if (!response.ok) throw new Error('Gagal memuat unit');
        const data = await response.json();
        setUnits(data);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Gagal mengambil data unit dari server.", variant: "destructive" });
      }
    };
    fetchUnits();
  }, [toast]);

  const addToCart = useCallback((item: MenuItem) => {
    if (!selectedUnit) {
      toast({ title: "Peringatan", description: "Pilih unit Anda terlebih dahulu!", variant: "destructive" });
      return;
    }
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return currentCart.map(cartItem => 
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...currentCart, { ...item, quantity: 1 }];
      }
    });
  }, [selectedUnit, toast]);

  const updateQuantity = (itemId: number, amount: number) => {
    setCart(currentCart => {
      return currentCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const { totalItemsInCart, totalPrice } = useMemo(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalItemsInCart: totalItems, totalPrice: total };
  }, [cart]);

  const handleOrderSubmit = async () => {
    if (cart.length === 0) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total: totalPrice, unit: selectedUnit }),
      });
      if (!response.ok) throw new Error('Gagal mengirim pesanan');
      
      toast({ 
        title: "Pesanan Berhasil!", 
        description: "Mohon tunggu, pesanan Anda sedang diproses.",
        duration: 5000,
      });
      setCart([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Gagal mengirim pesanan ke server.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const menuByCategory = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, []);
  const categories = Object.keys(menuByCategory);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-2xl pb-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Menu Makanan & Minuman</h1>
          <p className="mt-4 text-muted-foreground">Pesan langsung dari tempat bermain Anda.</p>
        </div>

        <div className="mt-8 max-w-sm mx-auto">
          <Select onValueChange={setSelectedUnit} value={selectedUnit} disabled={units.length === 0}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={units.length > 0 ? "Pilih Unit/Tempat Anda Bermain" : "Memuat unit..."} />
            </SelectTrigger>
            <SelectContent>
              {units.map(unit => (
                <SelectItem key={unit.id} value={unit.id}>{unit.id.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue={categories[0]} className="mt-10">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            {categories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}
          </TabsList>
          {categories.map(cat => (
            <TabsContent key={cat} value={cat}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {menuByCategory[cat].map(item => (
                  <Card key={item.id} className='bg-secondary/50 border-primary/20'>
                    <CardHeader><CardTitle>{item.name}</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <p className="font-semibold">Rp {item.price.toLocaleString('id-ID')}</p>
                      <Button size='icon' onClick={() => addToCart(item)} disabled={!item.available || !selectedUnit}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {totalItemsInCart > 0 && (
        <div className="fixed bottom-6 right-1/2 translate-x-1/2 z-50 w-full max-w-md px-4">
          <Button 
            className="w-full h-14 text-lg shadow-lg bg-[#FF9500] hover:bg-[#FF9500]/90 text-black" 
            onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Lihat Keranjang ({totalItemsInCart} Item)
          </Button>
        </div>
      )}

      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Pesanan Anda</DialogTitle></DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {cart.length > 0 ? cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-4 w-4" /></Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            )) : <p>Keranjang Anda kosong.</p>}
          </div>
          <DialogFooter className="sm:flex-col sm:space-y-2">
            <div className="flex justify-between items-center w-full text-lg font-bold">
              <span>Total:</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <Button type="button" className="w-full" onClick={handleOrderSubmit} disabled={isLoading || cart.length === 0}>
              {isLoading ? 'Mengirim Pesanan...' : 'Pesan Sekarang (Bayar di Tempat/Ruangan)'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
