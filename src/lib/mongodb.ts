
import mongoose from 'mongoose';

// Deklarasi variabel global untuk caching koneksi Mongoose
declare global {
  var mongoose: any; 
}

// Ambil URI MongoDB dari environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Harap definisikan variabel MONGODB_URI di dalam file .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('♻️  Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('⏳  Attempting new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅  New MongoDB connection successful!');
      return mongoose;
    }).catch(error => {
      console.error('❌  MongoDB connection error:', error);
      // Hapus promise yang gagal agar bisa mencoba lagi nanti
      cached.promise = null;
      throw error; // Lemparkan kembali error setelah dicatat
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Jika promise gagal, error akan ditangkap di sini
    cached.conn = null; // Pastikan koneksi yang gagal tidak di-cache
    throw error; // Lemparkan kembali error agar pemanggil tahu ada masalah
  }
  
  return cached.conn;
}

export default dbConnect;
