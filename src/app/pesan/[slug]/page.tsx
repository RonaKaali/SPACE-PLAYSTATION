"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { addDays, format } from "date-fns";
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon, Check, Package, Rocket } from "lucide-react";

import { consoles, gamePackages } from "@/lib/data";
import type { GamePackage } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type BookingPageProps = {
  params: {
    slug: string;
  };
};

export default function BookingPage({ params }: BookingPageProps) {
  const { toast } = useToast();
  const consoleData = consoles.find((c) => c.id === params.slug);

  const [date, setDate] = useState<{ from: Date | undefined; to?: Date | undefined } | undefined>();
  const [duration, setDuration] = useState<string>("1");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  if (!consoleData) {
    notFound();
  }

  const handleDateChange = (range: { from: Date | undefined; to?: Date | undefined } | undefined) => {
    if (range?.from) {
      const toDate = addDays(range.from, parseInt(duration, 10));
      setDate({ from: range.from, to: toDate });
    } else {
      setDate(undefined);
    }
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
    if (date?.from) {
      const toDate = addDays(date.from, parseInt(value, 10));
      setDate({ from: date.from, to: toDate });
    }
  };

  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId]
    );
  };
  
  const consolePrice = consoleData.pricePerDay * parseInt(duration, 10);
  const packagesPrice = selectedPackages.reduce((total, pkgId) => {
    const pkg = gamePackages.find(p => p.id === pkgId);
    return total + (pkg?.price || 0);
  }, 0);
  const totalPrice = consolePrice + packagesPrice;

  const handleBooking = () => {
    if (!date?.from) {
        toast({
            variant: "destructive",
            title: "Pemesanan Gagal",
            description: "Silakan pilih tanggal mulai sewa.",
        });
        return;
    }
    toast({
      title: "Pemesanan Berhasil!",
      description: `Anda telah menyewa ${consoleData.name} dari ${format(date.from, "PPP", { locale: id })} selama ${duration} hari.`,
      action: <div className="p-2 bg-green-500 text-white rounded-full"><Check className="w-4 h-4"/></div>,
    });
  };

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Card className="overflow-hidden">
            <CardHeader className="p-0">
              <Image
                src={consoleData.image.imageUrl}
                alt={consoleData.name}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                data-ai-hint={consoleData.image.imageHint}
              />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold font-headline">{consoleData.name}</h1>
              <p className="text-muted-foreground">{consoleData.description}</p>
              <div className="text-3xl font-bold text-primary">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(consoleData.pricePerDay)}
                <span className="text-sm font-normal text-muted-foreground">/hari</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Jadwalkan Rental Anda</CardTitle>
              <CardDescription>Pilih tanggal dan durasi sewa.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>Durasi Sewa</Label>
                 <Select value={duration} onValueChange={handleDurationChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih durasi" />
                    </SelectTrigger>
                    <SelectContent>
                        {[...Array(7)].map((_, i) => (
                            <SelectItem key={i + 1} value={`${i + 1}`}>
                                {i + 1} hari
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tanggal Mulai & Selesai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y", { locale: id })} -{" "}
                            {format(date.to, "LLL dd, y", { locale: id })}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y", { locale: id })
                        )
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="single"
                      selected={date?.from}
                      onSelect={(day) => handleDateChange({ from: day })}
                      numberOfMonths={1}
                      disabled={(day) => day < new Date(new Date().setHours(0,0,0,0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="w-6 h-6 text-primary"/> Tambah Paket Game</CardTitle>
              <CardDescription>Pilih paket game untuk melengkapi pengalaman bermainmu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {gamePackages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center space-x-3 p-3 rounded-md border has-[:checked]:bg-muted/50 has-[:checked]:border-primary">
                        <Checkbox id={pkg.id} onCheckedChange={() => handlePackageToggle(pkg.id)} />
                        <Label htmlFor={pkg.id} className="flex-grow flex justify-between items-center cursor-pointer">
                            <span>
                                <span className="font-medium">{pkg.name}</span>
                                <span className="text-xs text-muted-foreground block">{pkg.games.join(', ')}</span>
                            </span>
                            <span className="font-semibold text-primary">
                                +{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(pkg.price)}
                            </span>
                        </Label>
                    </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Biaya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Sewa Konsol ({duration} hari)</span>
                <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(consolePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Paket Game</span>
                <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(packagesPrice)}</span>
              </div>
               <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total Biaya</span>
                <span className="text-primary">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleBooking} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Rocket className="mr-2 h-5 w-5" /> Pesan & Bayar Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
