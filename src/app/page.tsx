import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gamepad, Rocket, Star } from "lucide-react";

import { consoles, gamePackages } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hero3D } from "@/components/hero-3d";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-grid-white/[0.05]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Selamat Datang di RentStation
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Pusat rental PlayStation termudah dan paling seru. Pilih konsol, pilih game, dan mulai petualanganmu hari ini!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="#konsol"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Sewa Sekarang
                </Link>
                <Link
                  href="/rekomendasi"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Rekomendasi AI
                </Link>
              </div>
            </div>
            <div className="hidden lg:block w-full h-[300px] xl:h-[400px]">
               <Hero3D />
            </div>
          </div>
        </div>
      </section>

      <section id="konsol" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pilihan Konsol</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Sewa Konsol Impianmu</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Dari kekuatan PS5 hingga koleksi game masif PS4, kami punya yang kamu butuhkan.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 sm:grid-cols-2 md:gap-12">
            {consoles.map((console) => (
              <Card key={console.id} className="group overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <Image
                    src={console.image.imageUrl}
                    alt={`Gambar ${console.name}`}
                    width={600}
                    height={400}
                    className="aspect-video w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={console.image.imageHint}
                  />
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle className="font-headline">{console.name}</CardTitle>
                  <CardDescription>{console.description}</CardDescription>
                  <div className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(console.pricePerDay)}
                    <span className="text-sm font-normal text-muted-foreground">/hari</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href={`/pesan/${console.id}`}>
                      <Rocket className="mr-2 h-4 w-4" /> Sewa Sekarang
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="paket-game" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Paket Game</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Lengkapi Rentalmu</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Tambahkan paket game populer kami untuk pengalaman bermain yang tak terlupakan.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
            {gamePackages.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Gamepad className="text-primary"/> {pkg.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <ul className="space-y-2 text-muted-foreground">
                    {pkg.games.map((game) => (
                      <li key={game} className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-accent" />
                        <span>{game}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-2">
                    <div className="text-xl font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(pkg.price)}
                    </div>
                   <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                     Tambah ke Pesanan
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
