'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Tag } from "lucide-react";
import { IOrder } from "@/lib/models/order";
import { cn } from "@/lib/utils";

type OrderCardProps = {
  order: IOrder;
  onStatusChange: (orderId: string, status: IOrder['status']) => void;
};

const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

const statusStyles: Record<IOrder['status'], { borderColor: string; label: string }> = {
  pending:   { borderColor: 'border-l-yellow-400', label: 'Menunggu' },
  cooking:   { borderColor: 'border-l-blue-400',   label: 'Dimasak' },
  completed: { borderColor: 'border-l-green-400',  label: 'Selesai' },
  cancelled: { borderColor: 'border-l-red-400',    label: 'Dibatalkan' },
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  // Guard clause untuk mencegah crash jika data tidak lengkap
  if (!order || !order.items || !order.total) {
    return null; 
  }

  const currentStatus = order.status;
  const isFinished = currentStatus === 'completed' || currentStatus === 'cancelled';

  return (
    <Card className={cn("bg-card border border-l-4 shadow-md animate-fade-in-down", statusStyles[currentStatus]?.borderColor)}>
        <CardHeader className="p-4">
            <CardTitle className="flex justify-between items-center text-lg">
                <span className="font-bold text-primary flex items-center gap-2"><Tag size={16}/> {order.unit}</span>
                <span className="text-sm font-normal text-muted-foreground flex items-center gap-1.5">
                    <Clock size={14}/>
                    {formatTime(order.createdAt)}
                </span>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
            <div className="space-y-2 text-sm">
                {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        {/* PERBAIKAN: Menggunakan item.name, bukan item.menuItem */}
                        <span className="capitalize">{item.name}</span>
                        <span className="font-semibold">x{item.quantity}</span>
                    </div>
                ))}
            </div>
        </CardContent>
        <CardFooter className="p-4 bg-secondary/30 flex justify-between items-center">
            <div className="font-bold text-lg">
                {/* PERBAIKAN: Menggunakan order.total, bukan order.totalAmount */}
                Total: Rp {order.total.toLocaleString('id-ID')}
            </div>

            <Select
              value={currentStatus}
              onValueChange={(newStatus: IOrder['status']) => onStatusChange(order._id, newStatus)}
              disabled={isFinished}
            >
              <SelectTrigger className="w-[150px] text-sm">
                <SelectValue placeholder="Ubah Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusStyles).map(([status, { label }]) => (
                  <SelectItem key={status} value={status}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </CardFooter>
    </Card>
  );
}
