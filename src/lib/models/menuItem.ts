
import mongoose, { Document, Schema, model, models } from 'mongoose';

// Definisikan tipe TypeScript untuk MenuItem
export interface IMenuItem extends Document {
  menuId: string; // ID unik dari data statis (contoh: 'mix-platter')
  name: string;
  price: number;
  category: string;
  available: boolean;
  description?: string;
}

// Definisikan Schema Mongoose
const MenuItemSchema = new Schema<IMenuItem>({
  menuId: { type: String, required: true, unique: true }, // Kolom baru untuk ID statis
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  available: { type: Boolean, default: true },
  description: { type: String, required: false }, // Deskripsi bersifat opsional
});

const MenuItem = models.MenuItem || model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
