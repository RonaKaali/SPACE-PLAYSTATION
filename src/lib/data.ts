import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Fallback for safety, though it should always be found
    return { id: 'fallback', description: 'Fallback image', imageUrl: 'https://picsum.photos/seed/fallback/600/400', imageHint: 'placeholder' };
  }
  return image;
};

export const consoles = [
  {
    id: 'ps5',
    name: 'PlayStation 5',
    description: 'Rasakan kecepatan luar biasa dengan SSD ultra-cepat, imersi mendalam dengan dukungan umpan balik haptic, pemicu adaptif, dan Audio 3D.',
    pricePerDay: 150000,
    image: findImage('ps5-console'),
  },
  {
    id: 'ps4',
    name: 'PlayStation 4',
    description: 'Jelajahi dunia game yang luar biasa dengan PS4. Perpustakaan game yang luas dengan harga yang lebih terjangkau.',
    pricePerDay: 80000,
    image: findImage('ps4-console'),
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
