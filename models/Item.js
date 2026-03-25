import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  visible: { type: Boolean, default: true },
  category: { type: String, default: "General" },
  image: String,
  modifiers: [{ name: String, price: Number }],
  isCombo: Boolean,
  comboItems: [{ itemId: String, qty: Number }],
  specials: [
    {
      startTime: String,
      endTime: String,
      days: [Number],
      specialPrice: Number
    }
  ],
  lowStockAt: { type: Number, default: 5 },
  reorderAt: { type: Number, default: 10 },
  supplierInfo: {
    name: String,
    phone: String,
    email: String
  }
});

export default mongoose.model("Item", itemSchema);