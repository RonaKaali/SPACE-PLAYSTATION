
import mongoose, { Document, Schema, model, models } from 'mongoose';

// Definisikan tipe TypeScript untuk MenuItem
export interface IMenuItem extends Document {
  id: string;
  name: string;
  price: number;
  category: 'Makanan' | 'Minuman' | 'Snack' | 'Kopi';
  available: boolean;
}

// Definisikan Schema Mongoose
const MenuItemSchema = new Schema<IMenuItem>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Makanan', 'Minuman', 'Snack', 'Kopi'], required: true },
  available: { type: Boolean, default: true }, // Default-nya, setiap item baru dianggap tersedia
});

// Mongoose akan membuat model baru JIKA belum ada. 
// Ini mencegah error saat hot-reloading di lingkungan pengembangan.
const MenuItem = models.MenuItem || model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
