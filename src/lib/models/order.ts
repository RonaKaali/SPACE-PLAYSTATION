
import mongoose, { Document, Schema, model, models } from 'mongoose';
import { IMenuItem } from './menuItem';

// Definisikan tipe untuk satu item dalam pesanan
export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId | IMenuItem; // Diubah ke ObjectId
  quantity: number;
  price: number; // Tambahkan harga saat itu
}

// Definisikan tipe untuk keseluruhan pesanan
export interface IOrder extends Document {
  unit: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'cooking' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Definisikan Schema Mongoose untuk satu item dalam pesanan
const OrderItemSchema = new Schema({
  menuItem: { type: Schema.Types.ObjectId, required: true, ref: 'MenuItem' }, // Diubah ke ObjectId dan ref
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // Tambahkan skema harga
}, { _id: false });

// Definisikan Schema Mongoose untuk keseluruhan pesanan
const OrderSchema = new Schema<IOrder>({
  unit: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'cooking', 'completed', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
