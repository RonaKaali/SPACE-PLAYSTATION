
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";

// Definisikan tipe data untuk sebuah pesanan
export type Order = {
  id: number;
  unit: string;
  items: { name: string; quantity: number }[];
  total: number;
  time: string; // ISO string format
};

// Tipe untuk props komponen OrderCard
type OrderCardProps = {
  order: Order;
  onDone: (orderId: number) => void;
};

// Fungsi untuk memformat waktu agar lebih mudah dibaca
const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function OrderCard({ order, onDone }: OrderCardProps) {
  return (
    <Card className="bg-card border border-l-4 border-l-primary shadow-md animate-fade-in-down">
        <CardHeader className="p-4">
            <CardTitle className="flex justify-between items-center text-lg">
                <span>Pesanan dari: <span className="font-bold text-primary">{order.unit}</span></span>
                <span className="text-sm font-normal text-muted-foreground flex items-center gap-1.5">
                    <Clock size={14}/>
                    {formatTime(order.time)}
                </span>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
            <div className="space-y-2 text-sm">
                {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="font-semibold">x{item.quantity}</span>
                    </div>
                ))}
            </div>
        </CardContent>
        <CardFooter className="p-4 bg-secondary/30 flex justify-between items-center">
            <div className="font-bold text-lg">
                Total: Rp {order.total.toLocaleString('id-ID')}
            </div>
            <Button size="sm" onClick={() => onDone(order.id)} className="flex items-center gap-2">
                <CheckCircle size={16} />
                Tandai Selesai
            </Button>
        </CardFooter>
    </Card>
  );
}
