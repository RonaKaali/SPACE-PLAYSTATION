
'use client';
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Twitch, Twitter, Facebook } from 'lucide-react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import AudioPlayer from '@/components/AudioPlayer';

export default function HomePage() {
  const router = useRouter();
  const { ref, inView } = useInView({
    triggerOnce: false, // Animate every time it comes into view
    threshold: 0.1,    // Trigger when 10% of the element is visible
  });

  return (
    <div className="relative w-full" style={{ perspective: '1000px' }}>
      <AudioPlayer src="/music/SELAMAT DATANG DI WE.mp3" />
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center text-white px-4">
        <div ref={ref} className="flex flex-col items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <div
              className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0 rotate-x-0' : 'opacity-0 translate-y-10 -rotate-x-45'}`}
            >
              <Image
                  src="/images/logo.png"
                  alt="Space Playstation Logo"
                  width={150}
                  height={150}
                  className="mb-6 rounded-full border-4 border-primary"
              />
            </div>

            <div
              className={`transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0 rotate-x-0' : 'opacity-0 translate-y-10 -rotate-x-45'} animate-shake`}
            >
              <Image
                src="/images/KATA-KATA.png"
                alt="Space Playstation"
                width={500}
                height={100}
                className="mb-6"
              />
            </div>

            <div className={`flex flex-col gap-4 transition-all duration-1000 delay-600 ${inView ? 'opacity-100 translate-y-0 rotate-x-0' : 'opacity-0 translate-y-10 -rotate-x-45'}`}>
              <Button
                  className="bg-primary hover:bg-primary/90 font-bold px-6 py-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-pulse-pop"
                  onClick={() => router.push('/reservation')}
              >
                  PESAN TEMPAT SEKARANG!!
              </Button>
              <Button
                  className="bg-primary hover:bg-primary/90 font-bold px-6 py-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  onClick={() => router.push('/availability')}
              >
                  Lihat Ketersediaan Tempat Langsung
              </Button>
              <Button
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-6 py-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  onClick={() => router.push('/menu')}
              >
                  Pemesanan Makanan
              </Button>
            </div>

            <div
              className={`mt-10 flex space-x-4 transition-all duration-1000 delay-800 ${inView ? 'opacity-100 translate-y-0 rotate-x-0' : 'opacity-0 translate-y-10 -rotate-x-45'}`}
            >
              <Link href="#" className="text-primary hover:text-white transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="text-primary hover:text-white transition-colors"><Youtube size={20} /></Link>
              <Link href="#" className="text-primary hover:text-white transition-colors"><Twitch size={20} /></Link>
              <Link href="#" className="text-primary hover:text-white transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="text-primary hover:text-white transition-colors"><Facebook size={20} /></Link>
            </div>
        </div>
      </div>
      {/* Placeholder div to enable scrolling */}
      <div className="h-screen"></div>
    </div>
  );
}
