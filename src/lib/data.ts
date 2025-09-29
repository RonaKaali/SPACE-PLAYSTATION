import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    return { id: 'fallback', description: 'Fallback image', imageUrl: 'https://picsum.photos/seed/fallback/600/400', imageHint: 'placeholder' };
  }
  return image;
};

export const consoles = [
  {
    id: 'ps5',
    name: 'PlayStation 5',
    description: 'Rasakan kecepatan luar biasa dengan SSD ultra-cepat, imersi mendalam dengan dukungan umpan balik haptic, pemicu adaptif, dan Audio 3D.',
    image: findImage('ps5-console'),
  },
  {
    id: 'ps4',
    name: 'PlayStation 4',
    description: 'Jelajahi dunia game yang luar biasa dengan PS4. Perpustakaan game yang luas dengan harga yang lebih terjangkau.',
    image: findImage('ps4-console'),
  },
];

export const rentalSpaces = [
  {
    id: 'regular',
    name: 'Regular Space',
    units: 6,
    console: 'ps4',
    price1hr: 10000,
    price3hr: 25000,
    netflix: false,
    image: findImage('regular-space'),
  },
  {
    id: 'private',
    name: 'Private Room',
    units: 6,
    console: 'ps4',
    price1hr: 12000,
    price3hr: 30000,
    netflix: false,
    image: findImage('private-space'),
  },
  {
    id: 'vip1',
    name: 'VIP 01',
    units: 1,
    console: 'ps4',
    price1hr: 20000,
    price3hr: 50000,
    netflix: true,
    image: findImage('premium-space'), 
  },
  {
    id: 'vip2',
    name: 'VIP 02',
    units: 1,
    console: 'ps5',
    price1hr: 28000,
    price3hr: 80000,
    netflix: true,
    image: findImage('premium-space'),
  },
  {
    id: 'vip3',
    name: 'VIP 03',
    units: 1,
    console: 'ps5',
    price1hr: 28000,
    price3hr: 80000,
    netflix: true,
    image: findImage('premium-space'),
  },
];


export const gamePackages = [
  {
    id: 'sport-lovers',
    name: 'Pecinta Olahraga',
    games: ['FIFA 23', 'NBA 2K23'],
    price: 50000,
    image: findImage('fifa-23'),
  },
  {
    id: 'adventure-pack',
    name: 'Paket Petualangan',
    games: ['Hogwarts Legacy', 'God of War: Ragnarok'],
    price: 75000,
    image: findImage('hogwarts-legacy'),
  },
  {
    id: 'ultimate-pack',
    name: 'Paket Ultimate',
    games: ['FIFA 23', 'NBA 2K23', 'Hogwarts Legacy', 'God of War: Ragnarok'],
    price: 100000,
    image: findImage('god-of-war'),
  },
];

export type Console = typeof consoles[0];
export type GamePackage = typeof gamePackages[0];
export type RentalSpace = typeof rentalSpaces[0];
