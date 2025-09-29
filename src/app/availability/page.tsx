
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Film } from 'lucide-react';
import { rentalSpaces } from '@/lib/data';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Tersedia':
      return 'text-green-500';
    case 'Digunakan':
      return 'text-red-500';
    case 'Perbaikan':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};

const generateInitialStations = () => {
  let stations: any[] = [];
  rentalSpaces.forEach(space => {
    if (space.units > 1) {
      for (let i = 1; i <= space.units; i++) {
        stations.push({
          ...space,
          id: `${space.id}-${i}`,
          name: `${space.name} ${i}`,
          status: 'Tersedia',
        });
      }
    } else {
      stations.push({ ...space, status: 'Tersedia' });
    }
  });
  return stations;
};

export default function AvailabilityPage() {
  const [stations, setStations] = useState(generateInitialStations());
  const [selectedCategory, setSelectedCategory] = useState('regular');

  useEffect(() => {
    const interval = setInterval(() => {
      setStations(prevStations =>
        prevStations.map(station => {
          if (Math.random() > 0.85) { 
            return {
              ...station,
              status: station.status === 'Tersedia' ? 'Digunakan' : 'Tersedia',
            };
          }
          return station;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredStations = stations.filter(station => {
    if (selectedCategory === 'vip') {
      return station.id.startsWith('vip');
    }
    return station.id.startsWith(selectedCategory);
  });

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold tracking-tight text-center sm:text-4xl font-headline">Laporan Ketersediaan Langsung</h1>
        <p className="mt-4 text-center text-muted-foreground">Pilih kategori untuk melihat status ketersediaan tempat secara real-time.</p>
        
        <div className="mt-8 flex justify-center gap-2">
          <Button onClick={() => setSelectedCategory('regular')} variant={selectedCategory === 'regular' ? 'default' : 'outline'}>Regular</Button>
          <Button onClick={() => setSelectedCategory('private')} variant={selectedCategory === 'private' ? 'default' : 'outline'}>Private</Button>
          <Button onClick={() => setSelectedCategory('vip')} variant={selectedCategory === 'vip' ? 'default' : 'outline'}>VIP</Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {filteredStations.map(station => (
            <Card key={station.id} className="bg-secondary/50 border-primary/20">
              <CardHeader className='p-4'>
                <CardTitle className="flex items-center justify-between text-base">
                  {station.name}
                  <div className={`text-base font-bold ${getStatusColor(station.status)}`}>
                    {station.status}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                <div className="flex items-start justify-between text-xs text-muted-foreground">
                    <div className='flex flex-col gap-1'>
                        <p>1 Jam: Rp {station.price1hr.toLocaleString('id-ID')}</p>
                        <p>3 Jam: Rp {station.price3hr.toLocaleString('id-ID')}</p>
                    </div>
                    <div className='flex flex-col items-end text-right gap-1'>
                        <div className={`flex items-center gap-1 font-semibold ${station.console === 'ps5' ? 'text-blue-400' : 'text-gray-300'}`}>
                            <Gamepad2 size={16} />
                            <span>{station.console.toUpperCase()}</span>
                        </div>
                        {station.netflix && (
                            <div className="flex items-center gap-1 font-semibold text-red-500">
                                <Film size={16} />
                                <span>Netflix</span>
                            </div>
                        )}
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
