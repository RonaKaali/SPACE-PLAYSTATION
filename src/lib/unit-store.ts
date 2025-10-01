
// src/lib/unit-store.ts
// Pusat data tunggal untuk status unit rental.
// Ini berjalan di sisi server dan menyimpan status saat ini dalam memori.

// --- Tipe Data ---
type RentalUnitStatus = {
  id: string;
  status: 'Tersedia' | 'Digunakan';
  remainingTime: number; // Dalam detik
  timerEnds: number | null; // Timestamp kapan timer berakhir
};

// --- Inisialisasi Data ---
const allUnitIds = [
    // VIP
    'vip-1', 'vip-2', 'vip-3',
    // Private
    'private-1', 'private-2', 'private-3', 'private-4', 'private-5', 'private-6',
    // Regular
    'regular-1', 'regular-2', 'regular-3', 'regular-4', 'regular-5', 'regular-6',
];

// --- Penyimpanan Dalam Memori (In-Memory Store) ---
const unitStateStore: Record<string, RentalUnitStatus> = {};

// Inisialisasi semua unit dengan status "Tersedia"
allUnitIds.forEach(id => {
    unitStateStore[id] = {
        id,
        status: 'Tersedia',
        remainingTime: 0,
        timerEnds: null,
    };
});

// --- Logika untuk Memeriksa dan Memperbarui Timer ---
/**
 * Menghitung ulang timer untuk semua unit yang sedang digunakan.
 * Jika waktu habis, unit akan diatur ke 'Tersedia'.
 * Jika masih berjalan, `remainingTime` akan diperbarui ke nilai saat ini.
 */
const recalculateAllTimers = () => {
    const now = Date.now();
    for (const id in unitStateStore) {
        const unit = unitStateStore[id];

        // Hanya proses unit yang sedang digunakan dan memiliki waktu akhir
        if (unit.status === 'Digunakan' && unit.timerEnds) {
            if (now >= unit.timerEnds) {
                // Waktu sudah habis, atur unit kembali ke 'Tersedia'
                unit.status = 'Tersedia';
                unit.remainingTime = 0;
                unit.timerEnds = null;
                console.log(`[Unit Store] Timer untuk unit ${id} telah berakhir. Status diatur ke Tersedia.`);
            } else {
                // Waktu masih berjalan, hitung ulang sisa waktu
                const newRemainingTime = Math.round((unit.timerEnds - now) / 1000);
                unit.remainingTime = newRemainingTime;
                // console.log(`[Unit Store] Timer untuk unit ${id} dihitung ulang. Sisa waktu: ${newRemainingTime} detik.`);
            }
        }
    }
};


// --- Fungsi untuk Mengakses dan Memodifikasi Store ---

/**
 * Mengambil status terbaru dari semua unit.
 * Secara otomatis menghitung ulang semua timer sebelum mengembalikan data.
 */
export const getAllUnitStatuses = (): RentalUnitStatus[] => {
    recalculateAllTimers(); // Logika krusial ada di sini!
    return Object.values(unitStateStore);
};

/**
 * Memperbarui status satu unit.
 * @param id ID unit yang akan diperbarui.
 * @param newStatus Status baru ('Tersedia' atau 'Digunakan').
 * @param remainingTime Sisa waktu dalam detik (durasi awal).
 */
export const updateUnitStatus = (id: string, newStatus: 'Tersedia' | 'Digunakan', remainingTime: number): RentalUnitStatus | null => {
    if (!unitStateStore[id]) {
        console.error(`[Unit Store] Error: Unit dengan ID ${id} tidak ditemukan.`);
        return null;
    }

    const unit = unitStateStore[id];
    unit.status = newStatus;

    if (newStatus === 'Digunakan' && remainingTime > 0) {
        // Sesi dimulai: simpan durasi awal dan hitung waktu berakhirnya
        unit.remainingTime = remainingTime;
        unit.timerEnds = Date.now() + remainingTime * 1000;
    } else {
        // Sesi berakhir atau diatur manual ke 'Tersedia'
        unit.remainingTime = 0;
        unit.timerEnds = null;
    }

    console.log(`[Unit Store] Status unit ${id} diperbarui:`, unit);
    return unit;
};
