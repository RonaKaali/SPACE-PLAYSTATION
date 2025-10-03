"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItems = void 0;
exports.menuItems = [
    // Platter
    {
        id: 'mix-platter',
        name: 'Mix Platter',
        category: 'Platter',
        price: 30000,
        available: true,
        description: 'Sosis, Nugget Ayam, Siomay dan Kentang Goreng dengan taburan oregano ditambah dengan saus sambal dan saus tomat.'
    },
    {
        id: 'jumbo-platter',
        name: 'Jumbo Platter',
        category: 'Platter',
        price: 60000,
        available: true,
        description: 'Sosis, Nugget Ayam, Siomay, Kentang Goreng, Otak Otak Ikan dan Tahu Bakso dengan taburan oregano ditambah saus mayonaise dan saus sambal dan tomat.'
    },
    {
        id: 'family-platter',
        name: 'Family Platter',
        category: 'Platter',
        price: 80000,
        available: true,
        description: 'Sosis, Nugget Ayam, Siomay, Kentang Goreng, Chiken Wings, Otak Otak Ikan, Sosis Jumbo dan Tahu Bakso ditaburi dengan oregano ditambah dengan saus mayonaise dan saus sambal dan saus tomat.'
    },
    // Mie Instant - Kuah
    { id: 'soto-banjar-limau-kuit', name: 'Soto Banjar Limau Kuit + Telur', category: 'Mie Instant', price: 10000, available: true },
    { id: 'kari-ayam', name: 'Kari Ayam + Telur', category: 'Mie Instant', price: 10000, available: true },
    { id: 'soto-lamongan', name: 'Soto Lamongan + Telur', category: 'Mie Instant', price: 10000, available: true },
    // Mie Instant - Goreng
    { id: 'indomie-original', name: 'Indomie Original + Telur', category: 'Mie Instant', price: 10000, available: true },
    { id: 'indomie-aceh', name: 'Indomie Aceh + Telur', category: 'Mie Instant', price: 10000, available: true },
    { id: 'indomie-hype-abis', name: 'Indomie Hype Abis + Telur', category: 'Mie Instant', price: 10000, available: true },
    // Mie Instant - Jumbo
    { id: 'indomie-jumbo', name: 'Indomie Jumbo + Telur', category: 'Mie Instant', price: 15000, available: true },
    { id: 'sarimi-isi-2-ayam-kecap', name: 'Sarimi Isi 2 Ayam Kecap + Telur', category: 'Mie Instant', price: 15000, available: true },
    { id: 'sarimi-ayam-kremes', name: 'Sarimi Ayam Kremes + Telur', category: 'Mie Instant', price: 15000, available: true },
    // Add On
    { id: 'telor-ayam', name: 'Telor Ayam', category: 'Add On', price: 3000, available: true },
    { id: 'telor-bebek', name: 'Telor Bebek', category: 'Add On', price: 7000, available: true },
    { id: 'telor-asin', name: 'Telor Asin', category: 'Add On', price: 8000, available: true },
    // Snacks
    { id: 'nugget-ayam', name: 'Nugget Ayam', category: 'Snacks', price: 15000, available: true },
    { id: 'sosis-goreng', name: 'Sosis Goreng', category: 'Snacks', price: 15000, available: true },
    { id: 'sosis-jumbo', name: 'Sosis Jumbo', category: 'Snacks', price: 10000, available: true },
    { id: 'cireng-bandung', name: 'Cireng Bandung', category: 'Snacks', price: 15000, available: true },
    { id: 'siomay-goreng', name: 'Siomay Goreng', category: 'Snacks', price: 15000, available: true },
    { id: 'kentang-goreng', name: 'Kentang Goreng', category: 'Snacks', price: 15000, available: true },
    { id: 'pisang-coklat', name: 'Pisang Coklat', category: 'Snacks', price: 15000, available: true },
    { id: 'dimsum-mentai-chili-oil', name: 'Dimsum Mentai Chili Oil', category: 'Snacks', price: 20000, available: true },
    { id: 'otak-otak-ikan', name: 'Otak Otak Ikan', category: 'Snacks', price: 15000, available: true },
    { id: 'roti-maryam-coklat-keju', name: 'Roti Maryam Coklat Keju', category: 'Snacks', price: 15000, available: true },
    { id: 'roti-maryam-keju', name: 'Roti Maryam Keju', category: 'Snacks', price: 13000, available: true },
    { id: 'gyoza-ikan', name: 'Gyoza Ikan', category: 'Snacks', price: 13000, available: true },
    { id: 'churros', name: 'Churros', category: 'Snacks', price: 15000, available: true },
    { id: 'tahu-bakso', name: 'Tahu Bakso', category: 'Snacks', price: 10000, available: true },
    // Mocktails
    { id: 'blue-yakult', name: 'Blue Yakult', category: 'Mocktails', price: 13000, available: true },
    { id: 'green-emerald', name: 'Green Emerald', category: 'Mocktails', price: 13000, available: true },
    { id: 'citrusina', name: 'Citrusina', category: 'Mocktails', price: 13000, available: true },
    { id: 'manggo-lemonade', name: 'Manggo Lemonade', category: 'Mocktails', price: 10000, available: true },
    { id: 'blue-ocean', name: 'Blue Ocean', category: 'Mocktails', price: 13000, available: true },
    { id: 'lecy-zoda', name: 'Lecy Zoda', category: 'Mocktails', price: 13000, available: true },
    // Drinks - Non Coffee
    { id: 'red-velvet', name: 'Red Velvet', category: 'Drinks', price: 10000, available: true },
    { id: 'matcha', name: 'Matcha', category: 'Drinks', price: 10000, available: true },
    { id: 'choco-oreo', name: 'Choco Oreo', category: 'Drinks', price: 10000, available: true },
    { id: 'choco-hazelnut', name: 'Choco Hazelnut', category: 'Drinks', price: 10000, available: true },
    { id: 'thai-tea', name: 'Thai Tea', category: 'Drinks', price: 10000, available: true },
    // Drinks - Coffee
    { id: 'kopsu-latte', name: 'Kopsu Latte', category: 'Drinks', price: 10000, available: true },
    { id: 'kopsu-pandan', name: 'Kopsu Pandan', category: 'Drinks', price: 13000, available: true },
    { id: 'kopsu-butter-scotch', name: 'Kopsu Butter Scotch', category: 'Drinks', price: 15000, available: true },
    { id: 'kopsu-creme-brulee', name: 'Kopsu Creme Brulee', category: 'Drinks', price: 15000, available: true },
    { id: 'kopsu-brown-sugar', name: 'Kopsu Brown Sugar', category: 'Drinks', price: 15000, available: true },
];
