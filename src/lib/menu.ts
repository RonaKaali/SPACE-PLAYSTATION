
export const menuItems = [
  // Minuman Dingin
  {
    id: 'es-teh-manis',
    name: 'Es Teh Manis',
    category: 'Minuman',
    price: 5000,
    available: true,
  },
  {
    id: 'es-jeruk',
    name: 'Es Jeruk',
    category: 'Minuman',
    price: 6000,
    available: true,
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    category: 'Minuman',
    price: 8000,
    available: true,
  },

  // Kopi
  {
    id: 'kopi-hitam',
    name: 'Kopi Hitam',
    category: 'Kopi',
    price: 7000,
    available: true,
  },
  {
    id: 'kopi-susu',
    name: 'Kopi Susu',
    category: 'Kopi',
    price: 10000,
    available: true,
  },

  // Makanan Ringan
  {
    id: 'kentang-goreng',
    name: 'Kentang Goreng',
    category: 'Makanan',
    price: 15000,
    available: true,
  },
  {
    id: 'roti-bakar',
    name: 'Roti Bakar Coklat Keju',
    category: 'Makanan',
    price: 12000,
    available: true,
  },
  
  // Makanan Berat
  {
    id: 'indomie-telur',
    name: 'Indomie Goreng + Telur',
    category: 'Makanan',
    price: 13000,
    available: true,
  },
  {
    id: 'nasi-goreng',
    name: 'Nasi Goreng Spesial',
    category: 'Makanan',
    price: 20000,
    available: false, // Contoh item habis
  },
];

export type MenuItem = typeof menuItems[0];
