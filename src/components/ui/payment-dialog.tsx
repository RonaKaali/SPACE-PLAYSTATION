'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./button";
import { Separator } from "./separator";
import { CheckCircle2, FileText } from 'lucide-react';

interface PaymentDialogProps {
    trigger: React.ReactNode;
    reservationDetails: {
        name: string;
        phoneNumber: string;
        date: string;
        startTime: string;
        endTime: string;
        duration: number;
        service: string;
        console: string;
        totalPrice: number;
    }
}

function generateReservationId() {
    const prefix = "KUPL/";
    const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `${prefix}${randomPart}`;
}

export function PaymentDialog({ trigger, reservationDetails }: PaymentDialogProps) {
    const [step, setStep] = useState('details'); // details, qris, receipt
    const [paymentStatus, setPaymentStatus] = useState<'LUNAS' | 'BELUM DIBAYAR'>('BELUM DIBAYAR');
    const [reservationId, setReservationId] = useState("");

    const handleInitialPay = () => {
        setReservationId(generateReservationId());
    }

    const handlePayOnSite = () => {
        setPaymentStatus('BELUM DIBAYAR');
        setStep('receipt');
    }

    const handleContinueToQRIS = () => {
        setStep('qris');
    }

    const handlePaymentSuccess = () => {
        setPaymentStatus('LUNAS');
        setStep('receipt');
    }

    const finalPrice = reservationDetails.totalPrice;

    const detailItem = (label: string, value: string, valueClass? : string) => (
        <div className="flex flex-col space-y-0.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`font-semibold text-sm ${valueClass}`}>{value}</p>
        </div>
    );

    const renderDetails = () => (
        <>
            <DialogHeader className="p-4 pb-2">
                <DialogTitle className="text-center text-primary font-bold tracking-wider">PAYMENT</DialogTitle>
                <p className="text-center text-xs text-muted-foreground">Pilih metode pembayaran Anda</p>
            </DialogHeader>
            <div className="px-4 pb-4 space-y-3">
                <div className="bg-background/50 p-3 rounded-lg space-y-2.5">
                    {detailItem("ID Reservasi", reservationId)}
                    <Separator />
                    {detailItem("Detail Tempat", `${reservationDetails.console.toUpperCase()} ${reservationDetails.service}`)}
                     <Separator />
                    {detailItem("Jadwal", `${reservationDetails.date}, ${reservationDetails.startTime} - ${reservationDetails.endTime}`)}
                </div>
                <div className="bg-background/50 p-3 rounded-lg">
                    <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span className="text-primary">Rp {finalPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                     <Button onClick={handlePayOnSite} variant="outline" className="w-full font-bold text-base">Bayar di Tempat</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full bg-primary hover:bg-primary/90 font-bold text-base">Bayar Sekarang (QRIS)</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Anda akan diarahkan ke pembayaran QRIS</AlertDialogTitle>
                            <AlertDialogDescription>
                                Pastikan koneksi jaringan mu stabil dan jangan sampai halaman ini keluar ketika proses pembayaranmu!
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleContinueToQRIS}>Lanjutkan</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </>
    );

    const renderQRIS = () => (
        <>
            <DialogHeader className="p-4 pb-2">
                <div className="mx-auto">
                    <Image src="/images/ikuzo-logo.png" alt="Ikuzo Logo" width={80} height={40} />
                </div>
            </DialogHeader>
            <div className="px-4 pb-4 space-y-4 text-center">
                 <p className="font-bold text-xl">Rp {finalPrice.toLocaleString('id-ID')}</p>
                 <div className="flex justify-center">
                    <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://ikuzoplaystation.com/pay?id=${reservationId}&amount=${finalPrice}`} alt="QRIS Code" width={250} height={250} className="rounded-lg border p-2"/>
                 </div>
                 <p className="text-xs text-muted-foreground">Scan QRIS di atas untuk membayar</p>
                <Button onClick={handlePaymentSuccess} className="w-full">Check Status Pembayaran</Button>
                <p className="text-xs text-muted-foreground">Ini adalah simulasi pembayaran.</p>
            </div>
        </>
    );

    const renderReceipt = () => (
         <>
            <DialogHeader className="p-6 pb-4 items-center text-center">
                {paymentStatus === 'LUNAS' ? (
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : (
                    <FileText className="h-16 w-16 text-primary" />
                )}
                <DialogTitle className="text-2xl">{paymentStatus === 'LUNAS' ? 'Pembayaran Berhasil!' : 'Pemesanan Dikonfirmasi'}</DialogTitle>
                <p className="text-sm text-muted-foreground">{paymentStatus === 'LUNAS' ? 'Terima kasih. Pesanan Anda telah dikonfirmasi.' : 'Tunjukkan struk ini di kasir untuk pembayaran.'}</p>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-4">
                <div className="bg-background/50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total Tagihan</span>
                        <span className="font-bold text-lg text-primary">Rp {finalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <Separator />
                    {detailItem("Status Pembayaran", paymentStatus, paymentStatus === 'LUNAS' ? 'text-green-500' : 'text-yellow-500')}
                    <Separator />
                    {detailItem("ID Reservasi", reservationId)}
                    <Separator />
                     {detailItem("Nama Pemesan", reservationDetails.name)}
                    <Separator />
                    {detailItem("Detail Tempat", `${reservationDetails.console.toUpperCase()} ${reservationDetails.service}`)}
                    <Separator />
                    {detailItem("Jadwal", `${reservationDetails.date}, ${reservationDetails.startTime} - ${reservationDetails.endTime}`)}
                </div>
                <DialogTrigger asChild>
                     <Button variant="outline" className="w-full">Tutup</Button>
                </DialogTrigger>
            </div>
        </>
    )

    return (
        <Dialog onOpenChange={(open) => !open && setStep('details')}>
            <DialogTrigger asChild onClick={handleInitialPay}>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-xs bg-card border-secondary p-0">
                {step === 'details' && renderDetails()}
                {step === 'qris' && renderQRIS()}
                {step === 'receipt' && renderReceipt()}
            </DialogContent>
        </Dialog>
    );
}
