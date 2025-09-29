
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone } from 'lucide-react'; // DITAMBAHKAN: Ikon telepon

export function LocationCard() {
  const googleMapsLink = "https://www.google.com/maps/place/SPACE+PLAYSTATION/@-3.324272,114.613302,17z/data=!4m6!3m5!1s0x2de421df4a6f2041:0x647f65f6ec718d6d!8m2!3d-3.3242718!4d114.6133018!16s%2Fg%2F11k_g334_x?entry=ttu";
  const embedMapLink = "https://maps.google.com/maps?q=Space%20Playstation%20Banjarmasin&t=&z=16&ie=UTF8&iwloc=&output=embed";
  // DITAMBAHKAN: Tautan WhatsApp
  const whatsappLink = "https://wa.me/6285947145882";

  return (
    <div className="w-full bg-background/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-4xl font-bold font-headline text-white mb-8 uppercase tracking-wider">
         Lokasi
        </h2>
        <Card className="bg-secondary/50 border-primary/50 border-2 rounded-3xl overflow-hidden text-center shadow-lg">
          <div className="relative w-full h-64 md:h-96 rounded-t-3xl overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src={embedMapLink}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="p-6 space-y-4">
            <h3 className="font-bold text-2xl text-white">
              SPACE PLAYSTATION
            </h3>
            <p className="text-muted-foreground mt-2 text-base">
              Jl. AMD 2 Besar Komp. Citra Maya Asri, Pekapuran Raya, Kec. Banjarmasin Tim., Kota Banjarmasin, Kalimantan Selatan 70234
            </p>
            <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full max-w-xs mx-auto">
              <Button size="lg" className="w-full font-bold text-lg bg-primary hover:bg-primary/90 rounded-xl shadow-md transition-transform transform hover:scale-105">
                  LIHAT DI GOOGLE MAPS
              </Button>
            </a>
            {/* DITAMBAHKAN: Tombol Customer Service WhatsApp */}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full max-w-xs mx-auto">
              <Button size="lg" className="w-full font-bold text-lg bg-green-500 hover:bg-green-600 rounded-xl shadow-md transition-transform transform hover:scale-105 flex items-center gap-2">
                  <Phone size={20}/> CUSTOMER SERVICE
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
