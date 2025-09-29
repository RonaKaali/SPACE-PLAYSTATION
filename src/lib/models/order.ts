
import mongoose, { Document, Schema, model, models } from 'mongoose';

// Definisikan tipe untuk satu item dalam pesanan
export interface IOrderItem {
  menuItem: string; // Diubah ke string untuk mencocokkan ID slug (misal: "coca-cola")
  quantity: number;
}

// Definisikan tipe untuk keseluruhan pesanan
export interface IOrder extends Document {
  unit: string;        // DIUBAH: dari tableNumber (Number) menjadi unit (String)
  items: IOrderItem[];
  totalAmount: number; // DIUBAH: dari totalPrice menjadi totalAmount
  status: 'pending' | 'cooking' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Definisikan Schema Mongoose untuk satu item dalam pesanan
const OrderItemSchema = new Schema({
  // DIUBAH: Tipe diubah ke String dan ref dihapus agar cocok dengan data frontend
  menuItem: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

// Definisikan Schema Mongoose untuk keseluruhan pesanan
const OrderSchema = new Schema<IOrder>({
  // DIUBAH: field diubah menjadi 'unit' agar cocok dengan data frontend
  unit: { type: String, required: true },
  items: [OrderItemSchema],
  // DIUBAH: field diubah menjadi 'totalAmount' agar cocok dengan data frontend
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'cooking', 'completed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true, // Ini akan secara otomatis menambahkan `createdAt` dan `updatedAt`
});

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
