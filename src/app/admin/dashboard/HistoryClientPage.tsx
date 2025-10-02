'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Download, DollarSign, Hash, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { CompletedOrder } from './page';
import Link from 'next/link';

const convertToCSV = (data: CompletedOrder[]) => {
  const headers = ['ID Pesanan', 'Tanggal Selesai', 'Unit', 'Total Bayar', 'Item'];
  const rows = data.map(order => [
    order._id,
    format(new Date(order.updatedAt), 'yyyy-MM-dd HH:mm:ss'),
    order.unit,
    order.totalAmount || 0, // Fallback ke 0 jika tidak ada
    order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
  ].join(','));
  return [headers.join(','), ...rows].join('\r\n');
};

const downloadCSV = (csvString: string, filename: string) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default function HistoryClientPage({ initialOrders }: { initialOrders: CompletedOrder[] }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const filteredOrders = useMemo(() => {
    if (!dateRange || !dateRange.from) return initialOrders;
    const fromDate = dateRange.from;
    const toDate = dateRange.to || dateRange.from;

    return initialOrders.filter(order => {
      const orderDate = new Date(order.updatedAt);
      return orderDate >= fromDate && orderDate <= addDays(toDate, 1);
    });
  }, [initialOrders, dateRange]);

  const totalRevenue = useMemo(() => 
    filteredOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0), 
    [filteredOrders]
  );
  const totalOrders = filteredOrders.length;

  const handleDownload = () => {
    const from = dateRange?.from ? format(dateRange.from, 'dd-MM-yy') : '';
    const to = dateRange?.to ? format(dateRange.to, 'dd-MM-yy') : '';
    const filename = `Laporan_Pesanan_${from}_-_${to}.csv`;
    const csvData = convertToCSV(filteredOrders);
    downloadCSV(csvData, filename);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16 space-y-8">
        <div className="flex justify-between items-center gap-4">
            <div className='flex items-center gap-4'>
                <Link href="/admin" passHref>
                    <Button variant="outline" size="icon"><ArrowLeft/></Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Riwayat & Laporan</h1>
                    <p className="text-muted-foreground">Analisis dan ekspor data pesanan yang telah selesai.</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-card border">
            <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground"/>
                <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </div>
            <Button onClick={handleDownload} disabled={filteredOrders.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download Laporan (CSV)
            </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Rp {(totalRevenue || 0).toLocaleString('id-ID')}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pesanan Selesai</CardTitle>
                    <Hash className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Detail Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead className="text-right">Total Bayar</TableHead>
                                <TableHead>Item Dipesan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <TableRow key={order._id}>
                                        <TableCell>{format(new Date(order.updatedAt), 'dd MMM yyyy, HH:mm')}</TableCell>
                                        <TableCell className="font-medium">{order.unit}</TableCell>
                                        <TableCell className="text-right">Rp {(order.totalAmount || 0).toLocaleString('id-ID')}</TableCell>
                                        <TableCell className='text-sm text-muted-foreground'>
                                            {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Tidak ada data untuk periode yang dipilih.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
