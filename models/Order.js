import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: Number,
  items: [
    {
      id: String,
      name: String,
      qty: Number,
      modifiers: [{ name: String, price: Number }]
    }
  ],
  priority: String,
  notes: String,
  status: String,
  createdAt: Date,
  completedAt: Date
});

export default mongoose.model("Order", orderSchema);