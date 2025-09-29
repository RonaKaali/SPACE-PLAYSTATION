'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';
import '@/styles/day-picker.css';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentDialog } from '@/components/ui/payment-dialog';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const priceList = {
    regular: { ps4: { '1': 10000, '3': 25000, baseRate: 10000 }, },
    private: { ps4: { '1': 12000, '3': 30000, baseRate: 12000 }, },
    vip: {
        ps4: { '1': 20000, '3': 50000, baseRate: 20000 },
        ps5: { '1': 28000, '3': 80000, baseRate: 28000 },
    },
};

const spaces = {
  regular: { id: 'regular', name: 'Regular' },
  private: { id: 'private', name: 'Private' },
  vip: { id: 'vip', name: 'VIP (+ Netflix)' },
};

const generateTimeSlots = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    const day = selectedDate.getDay();
    const slots = [];
    let startHour = 10, endHour = 26;
    if (day === 5) { startHour = 14; endHour = 26; } 
    else if (day === 4) { startHour = 10; endHour = 18; }
    for (let i = startHour; i < endHour; i++) slots.push(`${String(i % 24).padStart(2, '0')}:00`);
    return slots;
};

const calculatePrice = (service: keyof typeof spaces | null, console: 'ps4' | 'ps5' | null, duration: number) => {
    if (duration <= 0 || !service || !console || !(service in priceList) || !(console in priceList[service])) return 0;
    const rates = priceList[service][console];
    const durationKey = String(duration);
    if (durationKey in rates) return rates[durationKey as '1' | '3'];
    return rates.baseRate * duration;
};

export default function ReservationPage() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedService, setSelectedService] = useState<keyof typeof spaces | null>(null);
  const [selectedConsole, setSelectedConsole] = useState<'ps4' | 'ps5' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
      const newTimeSlots = generateTimeSlots(selectedDate);
      setTimeSlots(newTimeSlots);
      if (newTimeSlots.length > 1) {
          setStartTime(newTimeSlots[0]);
          setEndTime(newTimeSlots[1]);
      } else if (newTimeSlots.length === 1) {
          setStartTime(newTimeSlots[0]);
          setEndTime(newTimeSlots[0]);
      } else {
          setStartTime(undefined);
          setEndTime(undefined);
      }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedService === 'regular' || selectedService === 'private') {
      setSelectedConsole('ps4');
    } else if (selectedService === 'vip') {
      setSelectedConsole(null);
    }
  }, [selectedService]);

  useEffect(() => {
    if (startTime && endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        let diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
        if (diff < 0) diff += 24;
        setDuration(diff);
        const price = calculatePrice(selectedService, selectedConsole, diff);
        setTotalPrice(price);
    } else {
        setDuration(0);
        setTotalPrice(0);
    }
  }, [startTime, endTime, selectedService, selectedConsole]);

  useEffect(() => {
    const isValid = name.trim() !== '' && phoneNumber.trim() !== '' && selectedService !== null && selectedConsole !== null && selectedDate !== undefined && duration > 0;
    setIsFormValid(isValid);
  }, [name, phoneNumber, selectedService, selectedConsole, selectedDate, duration]);

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Rencanakan Kunjungan Anda</h1>
        <p className="mt-4 text-muted-foreground">Lengkapi formulir di bawah untuk memesan waktu bermain Anda di Space Station.</p>
      </div>

      <Card className="mt-8 w-full max-w-5xl mx-auto bg-background/60 backdrop-blur-sm border-primary/20">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 gap-y-8">
            {/* --- KOLOM KIRI --- */}
            <div className="space-y-6">
              <h3 className="font-headline text-xl font-semibold">Langkah 1: Isi Detail Anda</h3>
              {/* DIUBAH: Tata letak Select diubah menjadi satu kolom penuh */}
              <div className="space-y-4">
                <div className="space-y-2"><Label htmlFor="name">Nama</Label><Input id="name" placeholder="Nama lengkap Anda" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="phone">No HP</Label><Input id="phone" placeholder="contoh: 08123456789" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="service">Tipe Ruangan</Label><Select onValueChange={(v: keyof typeof spaces) => setSelectedService(v)}><SelectTrigger><SelectValue placeholder="Pilih Tipe" /></SelectTrigger><SelectContent><SelectItem value="regular">{spaces.regular.name}</SelectItem><SelectItem value="vip">{spaces.vip.name}</SelectItem><SelectItem value="private">{spaces.private.name}</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="console">Pilih Konsol</Label>
                <Select onValueChange={(v: 'ps4' | 'ps5') => setSelectedConsole(v)} value={selectedConsole || ''} disabled={selectedService !== 'vip'}>
                  <SelectTrigger><SelectValue placeholder="Pilih Konsol" /></SelectTrigger>
                  <SelectContent>
                    {selectedService === 'vip' ? (<><SelectItem value="ps4">PlayStation 4</SelectItem><SelectItem value="ps5">PlayStation 5</SelectItem></>) : (<SelectItem value="ps4">PlayStation 4</SelectItem>)}
                  </SelectContent>
                </Select>
                </div>
              </div>
            </div>

            {/* --- KOLOM KANAN --- */}
            <div className="space-y-6">
                <div>
                    <h3 className="font-headline text-xl font-semibold mb-3">Langkah 2: Pilih Tanggal</h3>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal border-white/30 bg-background/50 hover:bg-background/70 hover:text-white", !selectedDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-secondary border-primary/50" align="start">
                            <DayPicker mode="single" selected={selectedDate} onSelect={(date) => {setSelectedDate(date); setIsCalendarOpen(false);}} disabled={{ before: new Date() }} initialFocus locale={id}/>
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <h3 className="font-headline text-xl font-semibold mb-3">Langkah 3: Pilih Waktu</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="start-time">Waktu Mulai</Label><Select value={startTime} onValueChange={setStartTime} disabled={!selectedDate}><SelectTrigger id="start-time"><SelectValue placeholder="Pilih waktu" /></SelectTrigger><SelectContent>{timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="end-time">Waktu Selesai</Label><Select value={endTime} onValueChange={setEndTime} disabled={!selectedDate}><SelectTrigger id="end-time"><SelectValue placeholder="Pilih waktu" /></SelectTrigger><SelectContent>{timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                </div>
            </div>
          </div>

          <Separator className="my-8 bg-primary/20" />
          
          <div className="flex flex-col items-center gap-4">
             <div className="text-center">
                <p className="text-muted-foreground">Total Biaya untuk <span className="font-bold text-white">{duration} Jam</span></p>
                <p className="font-bold text-4xl text-primary">Rp {totalPrice.toLocaleString('id-ID')}</p>
             </div>
             <PaymentDialog 
                reservationDetails={{
                    name, phoneNumber, 
                    date: selectedDate ? format(selectedDate, 'E, d LLL yyyy', { locale: id }) : 'N/A',
                    startTime: startTime || 'N/A', endTime: endTime || 'N/A', duration,
                    service: selectedService ? spaces[selectedService].name : 'N/A',
                    console: selectedConsole ? (selectedConsole === 'ps4' ? 'PlayStation 4' : 'PlayStation 5') : 'N/A',
                    totalPrice
                }}
                trigger={ <Button size="lg" className="w-full max-w-xs font-bold text-lg bg-primary hover:bg-primary/90 rounded-xl shadow-md transition-transform transform hover:scale-105" disabled={!isFormValid}>Booking & Bayar Sekarang</Button>}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
