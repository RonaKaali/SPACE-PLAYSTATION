
import mongoose, { Document, Schema, model, models } from 'mongoose';

// Definisikan tipe TypeScript untuk Booking
export interface IBooking extends Document {
  name: string;
  phone: string;
  unitType: 'private' | 'regular' | 'vip' | 'vip (+ netflix)'; // DIUBAH
  console: 'PS4' | 'PS5' | 'Nintendo Switch';
  bookingDate: Date;
  startTime: string;
  endTime: string;
  totalPrice: number;
  paymentStatus: 'unpaid' | 'paid';
}

// Definisikan Schema Mongoose
const BookingSchema = new Schema<IBooking>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  // DIUBAH: Tambahkan nilai baru ke enum
  unitType: { type: String, enum: ['private', 'regular', 'vip', 'vip (+ netflix)'], required: true }, 
  console: { type: String, enum: ['PS4', 'PS5', 'Nintendo Switch'], required: true },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
}, {
  timestamps: true,
});

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
