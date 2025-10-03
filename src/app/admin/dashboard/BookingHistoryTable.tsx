'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingData } from './page'; // Sesuaikan path jika perlu
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Definisikan props untuk komponen, termasuk fungsi onStatusChange
interface BookingHistoryTableProps {
  bookings: BookingData[];
  onStatusChange: (bookingId: string) => Promise<void>;
}

// Fungsi untuk memformat tanggal
const formatDate = (date: string) => {
  return format(new Date(date), "E, d LLL yyyy", { locale: id });
};

// Komponen utama yang menerima props
export default function BookingHistoryTable({ bookings, onStatusChange }: BookingHistoryTableProps) {

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Riwayat Booking Tempat</h2>
      <Card>
        <CardContent className='p-0'>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Detail Unit</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Total Bayar</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <div className="font-medium">{booking.name}</div>
                        <div className="text-sm text-muted-foreground">{booking.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium capitalize">{booking.unitType}</div>
                        <div className="text-sm text-muted-foreground capitalize">{booking.console}</div>
                      </TableCell>
                      <TableCell>
                        <div>{formatDate(booking.bookingDate)}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                          {booking.paymentStatus === 'paid' ? 'Lunas' : 'Belum Bayar'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">Rp {booking.totalPrice.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-center">
                        {booking.paymentStatus === 'unpaid' && (
                          <Button size="sm" onClick={() => onStatusChange(booking._id)}>
                            Tandai Lunas
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Belum ada data booking.
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
