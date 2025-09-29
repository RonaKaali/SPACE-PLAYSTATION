
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AudioPlayer } from "@/components/audio-player";

export const metadata: Metadata = {
  title: "RentStation",
  description: "Sewa PlayStation mudah dan cepat. Pesan konsol dan paket game favoritmu sekarang!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen font-body antialiased flex justify-center bg-[#1a1a1a]"
        )}
      >
        <div 
          className="relative flex flex-col min-h-screen w-full max-w-md shadow-lg"
          style={{
            backgroundImage: 'url("https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnBvaDk5cnN1MDM5MmI0M2R4Mm5oaXppZDk3eHJnNTBxNTU1ZmluZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CQl0tM5gYyqQg/giphy.gif")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col min-h-screen bg-black/50">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </div>
        <Toaster />
        <AudioPlayer />
      </body>
    </html>
  );
}
