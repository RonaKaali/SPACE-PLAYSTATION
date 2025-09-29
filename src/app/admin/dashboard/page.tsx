'use client';

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue } from "firebase/database";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import withAuth from '@/components/auth/withAuth';

import { DayPicker } from 'react-day-picker';
import '@/styles/day-picker.css';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';

interface Booking {
    bookingId: string;
    name: string;
    phoneNumber: string;
    service: string;
    console: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    totalPrice: number;
    createdAt: string;
    status: 'pending' | 'LUNAS'; 
}

type GroupedBookings = Record<string, Booking[]>;

function DashboardPage() {
  const [groupedBookings, setGroupedBookings] = useState<GroupedBookings>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const bookingsRef = ref(database, 'bookings');
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsList: Booking[] = Object.keys(data).map(key => ({...data[key], bookingId: key}));
        
        const groups: GroupedBookings = bookingsList.reduce((acc, booking) => {
          const date = booking.date;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(booking);
          return acc;
        }, {} as GroupedBookings);

        for (const date in groups) {
            groups[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
        }

        setGroupedBookings(groups);
      } else {
        setGroupedBookings({});
      }
    });

    return () => unsubscribe();
  }, []);

  const formattedSelectedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const bookingsForSelectedDate = groupedBookings[formattedSelectedDate] || [];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Dashboard Admin</h1>
                    <p className="mt-2 text-muted-foreground">Lihat data pemesanan berdasarkan tanggal.</p>
                </div>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full sm:w-auto justify-start text-left font-normal mt-4 sm:mt-0", !selectedDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-secondary border-primary/50" align="start">
                        <DayPicker mode="single" selected={selectedDate} onSelect={(date) => {setSelectedDate(date); setIsCalendarOpen(false);}} initialFocus locale={id}/>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Pemesanan untuk: {selectedDate ? format(selectedDate, 'EEEE, d LLL yyyy', { locale: id }) : 'Pilih tanggal'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {bookingsForSelectedDate.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[150px]">Waktu</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Detail</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total Harga</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookingsForSelectedDate.map(booking => (
                                        <TableRow key={booking.bookingId}>
                                            {/* --- DIUBAH: Tampilkan rentang waktu dan durasi --- */}
                                            <TableCell>
                                                <div className="font-medium">{booking.startTime} - {booking.endTime}</div>
                                                <div className="text-xs text-muted-foreground">{booking.duration} jam</div>
                                            </TableCell>
                                            <TableCell>{booking.name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{booking.service} / {booking.console.toUpperCase()}</TableCell>
                                            <TableCell>
                                                <Badge variant={booking.status === 'LUNAS' ? 'success' : 'warning'}>
                                                    {booking.status === 'LUNAS' ? 'Lunas' : 'Belum Bayar'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">Rp {booking.totalPrice.toLocaleString('id-ID')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center h-24 flex items-center justify-center">
                                <p className="text-muted-foreground">Tidak ada pemesanan untuk tanggal ini.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

export default withAuth(DashboardPage);
