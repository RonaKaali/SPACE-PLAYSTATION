'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DayPicker } from 'react-day-picker';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';
import '@/styles/day-picker.css';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cigarette, Tv, Gamepad2, Users, Film } from 'lucide-react';
import { GameCatalogDialog } from '@/components/ui/game-catalog-dialog';
import { PaymentDialog } from '@/components/ui/payment-dialog';

const priceList = {
    private: {
        ps4: { 1: 12000, 2: 24000, 3: 30000, subsequent: 10000 },
    },
    vip: { // VIP Room
        ps4: { 1: 20000, 2: 40000, 3: 50000, subsequent: 15000 }, // VIP 01
        ps5: { 1: 28000, 2: 56000, 3: 80000, subsequent: 25000 }, // VIP 02 & 03
    },
    regular: {
        ps4: { 1: 10000, 2: 20000, 3: 25000, subsequent: 10000 },
    }
};

const spaces = {
  regular: {
    id: 'regular',
    name: 'Regular Space',
    image: '/images/regular-space.jpg',
    capacity: 'Kapasitas 1-2 Orang',
    smoking: true,
    tv: '43 Inci',
    controllers: 2,
    netflix: false,
  },
  vip: {
    id: 'vip',
    name: 'VIP Space',
    image: '/images/premium-space.jpg',
    capacity: 'Kapasitas 2-4 Orang',
    smoking: false,
    tv: '53 Inci',
    controllers: 2,
    netflix: true,
  },
  private: {
    id: 'private',
    name: 'Private Room',
    image: '/images/private-space.jpg',
    capacity: 'Kapasitas hingga 6 Orang',
    smoking: true,
    tv: '43 Inci',
    controllers: 2,
    netflix: false,
  },
};

const generateTimeSlots = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    const day = selectedDate.getDay();
    const slots = [];
    let startHour = 10, endHour = 26; // Default: 10:00 to 02:00 next day
    if (day === 5) { startHour = 14; endHour = 26; } // Friday
    else if (day === 4) { startHour = 10; endHour = 18; } // Thursday
    for (let i = startHour; i < endHour; i++) slots.push(`${String(i % 24).padStart(2, '0')}:00`);
    return slots;
};

const calculatePrice = (service: keyof typeof spaces, console: 'ps4' | 'ps5', duration: number) => {
    if (duration <= 0 || !priceList[service] || !priceList[service][console]) return 0;
    const rates = priceList[service][console];
    if (rates[duration as keyof typeof rates]) {
        return rates[duration as keyof typeof rates];
    }
    if (duration > 3) {
        return rates[3] + (duration - 3) * rates.subsequent;
    }
    return rates[1] * duration;
}

export default function ReservationPage() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedService, setSelectedService] = useState<keyof typeof spaces | null>(null);
  const [selectedConsole, setSelectedConsole] = useState<'ps4' | 'ps5' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [totalPrice, setTotalPrice] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
      const newTimeSlots = generateTimeSlots(selectedDate);
      setTimeSlots(newTimeSlots);
      if (newTimeSlots.length > 1) {
          setStartTime(newTimeSlots[0]);
          setEndTime(newTimeSlots[1]);
      } else if (newTimeSlots.length === 1) {
          setStartTime(newTimeSlots[0]);
          setEndTime(newTimeSlots[0]);
      }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedService === 'regular' || selectedService === 'private') {
      setSelectedConsole('ps4');
    } else {
      setSelectedConsole(null);
    }
  }, [selectedService]);

  useEffect(() => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    let diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    if (diff < 0) diff += 24; // Account for overnight booking
    setDuration(diff);

    if(selectedService && selectedConsole && diff > 0) {
        const price = calculatePrice(selectedService, selectedConsole, diff);
        setTotalPrice(price);
    }
  }, [startTime, endTime, selectedService, selectedConsole]);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight text-center sm:text-4xl font-headline">Rencanakan Kunjungan Anda</h1>
        <p className="mt-4 text-center text-muted-foreground">Anda selangkah lagi untuk dapat bermain di Space Station</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-8">
                <Card>
                  <CardHeader><CardTitle>Langkah 1: Isi Detail Anda</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 gap-6">
                    <div className="space-y-2"><Label htmlFor="name">Nama</Label><Input id="name" placeholder="Masukkan nama Anda" value={name} onChange={(e) => setName(e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="phone">No HP</Label><Input id="phone" placeholder="Masukkan nomor HP Anda" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="service">Tipe Ruangan</Label><Select onValueChange={(v: keyof typeof spaces) => setSelectedService(v)}><SelectTrigger><SelectValue placeholder="Pilih Tipe" /></SelectTrigger><SelectContent><SelectItem value="regular">Regular</SelectItem><SelectItem value="vip">VIP</SelectItem><SelectItem value="private">Private</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="console">Pilih Konsol</Label>
                        <Select onValueChange={(v: 'ps4' | 'ps5') => setSelectedConsole(v)} value={selectedConsole || ''} disabled={selectedService === 'regular' || selectedService === 'private'}>
                          <SelectTrigger><SelectValue placeholder="Pilih Konsol" /></SelectTrigger>
                          <SelectContent>
                            {selectedService === 'vip' ? (
                                <>
                                    <SelectItem value="ps4">PlayStation 4</SelectItem>
                                    <SelectItem value="ps5">PlayStation 5</SelectItem>
                                </>
                            ) : (
                                <SelectItem value="ps4">PlayStation 4</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Langkah 2: Pilih Tanggal</CardTitle></CardHeader>
                    <CardContent className="flex justify-center"><DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} className="p-0" locale={id} disabled={{ before: new Date() }} /></CardContent>
                </Card>
            </div>

            {selectedService && selectedConsole && selectedDate && (
              <div className="mt-0 md:mt-[-2.5rem]">
                <h2 className="text-2xl font-bold tracking-tight text-center sm:text-3xl font-headline mb-8">Langkah 3: Pilih Tempat</h2>
                 <div className="flex justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                         <Card className="cursor-pointer hover:border-primary transition-all overflow-hidden w-full max-w-sm"><CardHeader><CardTitle>{spaces[selectedService].name}</CardTitle></CardHeader><CardContent><div className="relative h-48 w-full mb-4"><Image src={spaces[selectedService].image} alt={spaces[selectedService].name} fill style={{ objectFit: 'cover' }} className="rounded-md" /></div><Button className="w-full">Pesan Tempat Ini</Button></CardContent></Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-card border-secondary">
                        <DialogHeader><DialogTitle>Pesan {spaces[selectedService].name} - {selectedConsole.toUpperCase()}</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div className="relative mx-auto w-full aspect-video">
                                <Image src={spaces[selectedService].image} alt={spaces[selectedService].name} fill className="object-cover rounded-md border" />
                                <div className={`absolute top-2 right-2 p-1.5 rounded-full ${spaces[selectedService].smoking ? 'bg-green-500/80' : 'bg-red-500/80'}`}><Cigarette className="h-5 w-5 text-white" /></div>
                                {spaces[selectedService].netflix && <div className={`absolute top-2 left-2 p-1.5 rounded-full bg-blue-500/80`}><Film className="h-5 w-5 text-white" /></div>}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                                <div className="flex items-center justify-center gap-1.5 bg-background p-2 rounded-md"><Users className="h-4 w-4" /><span>{spaces[selectedService].capacity}</span></div>
                                <div className="flex items-center justify-center gap-1.5 bg-background p-2 rounded-md"><Tv className="h-4 w-4" /><span>{spaces[selectedService].tv}</span></div>
                                <div className="flex items-center justify-center gap-1.5 bg-background p-2 rounded-md"><Gamepad2 className="h-4 w-4" /><span>{spaces[selectedService].controllers} Controller</span></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="space-y-2"><Label htmlFor="start-time">Waktu Mulai</Label><Select value={startTime} onValueChange={setStartTime}><SelectTrigger id="start-time"><SelectValue placeholder="Pilih waktu" /></SelectTrigger><SelectContent>{timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label htmlFor="end-time">Waktu Selesai</Label><Select value={endTime} onValueChange={setEndTime}><SelectTrigger id="end-time"><SelectValue placeholder="Pilih waktu" /></SelectTrigger><SelectContent>{timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}</SelectContent></Select></div>
                            </div>
                            <div className="pt-4 space-y-2">
                                <div className="flex justify-between items-center font-semibold text-lg"><span className='text-muted-foreground'>Durasi: {duration} Jam</span><span className='text-primary'>Rp {totalPrice.toLocaleString('id-ID')}</span></div>
                            </div>
                            <div className="flex flex-col gap-3 pt-4">
                               <PaymentDialog 
                                    reservationDetails={{
                                        name,
                                        phoneNumber,
                                        date: format(selectedDate, 'E, d LLL yyyy', { locale: id }),
                                        startTime,
                                        endTime,
                                        duration,
                                        service: spaces[selectedService].name,
                                        console: selectedConsole,
                                        totalPrice
                                    }}
                                    trigger={ <Button size="lg" className="w-full bg-primary hover:bg-primary/90">Lanjutkan & Bayar (Rp {totalPrice.toLocaleString('id-ID')})</Button>}
                                />
                                <GameCatalogDialog consoleType={selectedConsole} />
                            </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
