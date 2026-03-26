import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import multer from "multer";

import Order from "./models/Order.js";
import Item from "./models/Item.js";
import Staff from "./models/Staff.js";


// ===============================
// CONFIG
// ===============================

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET";
mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));


// ===============================
// UPLOADS
// ===============================

const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));


// ===============================
// AUTH MIDDLEWARE
// ===============================

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}


// ===============================
// SOCKET.IO
// ===============================

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", socket => {
  socket.on("track-order", id => socket.join(`order-${id}`));
});

function broadcastOrder(order) {
  io.emit("orders-updated", order);
  io.to(`order-${order.id}`).emit("order-updated", order);
}

function broadcastItems() {
  io.emit("items-updated");
}


// ===============================
// UPLOAD ENDPOINT
// ===============================

app.post("/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});


// ===============================
// LOGIN
// ===============================

app.post("/login", async (req, res) => {
  const user = await Staff.findOne({ username: req.body.user });
  if (!user) return res.json({ success: false });

  const valid = await bcrypt.compare(req.body.pass, user.passwordHash);
  if (!valid) return res.json({ success: false });

  const token = jwt.sign(
    { user: user.username, role: user.role },
    JWT_SECRET
  );

  res.json({ success: true, token });
});


// ===============================
// ITEMS
// ===============================

app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post("/items", auth, async (req, res) => {
  const item = await Item.create(req.body);
  broadcastItems();
  res.json(item);
});

app.patch("/items/:id", auth, async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  broadcastItems();
  res.json(item);
});

app.delete("/items/:id", auth, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  broadcastItems();
  res.json({ success: true });
});


// ===============================
// ORDERS
// ===============================

app.post("/order", async (req, res) => {
  const count = await Order.countDocuments();

  const order = await Order.create({
    id: count + 1,
    items: req.body.items,
    priority: req.body.priority || "Normal",
    notes: req.body.notes || "",
    status: "New",
    createdAt: new Date()
  });

  // Reduce stock
  for (const item of req.body.items) {
    const dbItem = await Item.findById(item.id);
    if (dbItem && dbItem.stock !== -1) {
      dbItem.stock -= item.qty;
      if (dbItem.stock < 0) dbItem.stock = 0;
      await dbItem.save();
    }
  }

  broadcastItems();
  broadcastOrder(order);
  res.json(order);
});

app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.patch("/orders/:id", auth, async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { id: Number(req.params.id) },
    req.body,
    { new: true }
  );

  if (!order) return res.status(404).json({ error: "Order not found" });

  if (req.body.status === "Completed") {
    order.completedAt = new Date();
    await order.save();
  }

  broadcastOrder(order);
  res.json(order);
});


// ===============================
// TRACKING
// ===============================

app.get("/track/:id", async (req, res) => {
  const order = await Order.findOne({ id: Number(req.params.id) });
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});


// ===============================
// START SERVER
// ===============================

server.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port 3000")
);
