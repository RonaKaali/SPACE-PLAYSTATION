'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Film } from 'lucide-react';
import { pusherClient } from '@/lib/pusher';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Tersedia': return 'text-green-500';
    case 'Digunakan': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

// --- PERBAIKAN: Mendefinisikan semua unit secara langsung untuk memastikan kelengkapan data ---
const generateInitialStations = () => {
  const stations: any[] = [
    // VIP Units
    { id: 'vip-1', name: 'VIP 01', console: 'ps4', netflix: true, price1hr: 15000, price3hr: 40000, status: 'Tersedia', category: 'vip' },
    { id: 'vip-2', name: 'VIP 02', console: 'ps5', netflix: true, price1hr: 20000, price3hr: 55000, status: 'Tersedia', category: 'vip' },
    { id: 'vip-3', name: 'VIP 03', console: 'ps5', netflix: true, price1hr: 20000, price3hr: 55000, status: 'Tersedia', category: 'vip' },
    
    // Private Units
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `private-${i + 1}`,
      name: `Private ${i + 1}`,
      console: 'ps4',
      netflix: false,
      price1hr: 10000,
      price3hr: 25000,
      status: 'Tersedia',
      category: 'private'
    })),

    // Regular Units
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `regular-${i + 1}`,
      name: `Regular ${i + 1}`,
      console: 'ps4',
      netflix: false,
      price1hr: 7000,
      price3hr: 20000,
      status: 'Tersedia',
      category: 'regular'
    })),
  ];
  return stations;
};

export default function AvailabilityPage() {
  const [stations, setStations] = useState(generateInitialStations());
  const [selectedCategory, setSelectedCategory] = useState('vip'); // Default ke VIP

  useEffect(() => {
    const channel = pusherClient.subscribe('unit-status');
    
    const handleUnitStatusUpdate = ({ id, newStatus }: { id: string; newStatus: 'Tersedia' | 'Digunakan' }) => {
      setStations(prevStations =>
        prevStations.map(station =>
          String(station.id) === id ? { ...station, status: newStatus } : station
        )
      );
    };

    channel.bind('status-update', handleUnitStatusUpdate);

    return () => {
      channel.unbind('status-update', handleUnitStatusUpdate);
      pusherClient.unsubscribe('unit-status');
    };
  }, []);

  // --- PERBAIKAN: Logika filter disederhanakan dan diperbaiki ---
  const filteredStations = stations.filter(station => station.category === selectedCategory);

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
