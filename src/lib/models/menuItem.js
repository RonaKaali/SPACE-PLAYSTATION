"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Definisikan Schema Mongoose
var MenuItemSchema = new mongoose_1.Schema({
    menuId: { type: String, required: true, unique: true }, // Kolom baru untuk ID statis
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    available: { type: Boolean, default: true },
    description: { type: String, required: false }, // Deskripsi bersifat opsional
});
var MenuItem = mongoose_1.models.MenuItem || (0, mongoose_1.model)('MenuItem', MenuItemSchema);
exports.default = MenuItem;
