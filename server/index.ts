import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { login, register, verifyToken, requireRole, getProfile } from "./routes/auth";
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  createBooking,
  getBookings,
  getDashboardStats
} from "./routes/hotel";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.get("/api/auth/profile", verifyToken, getProfile);

  // Hotel routes
  app.get("/api/rooms", getRooms);
  app.get("/api/rooms/:id", getRoom);
  app.post("/api/rooms", verifyToken, requireRole(['admin']), createRoom);
  app.put("/api/rooms/:id", verifyToken, requireRole(['admin']), updateRoom);
  app.delete("/api/rooms/:id", verifyToken, requireRole(['admin']), deleteRoom);

  // Booking routes
  app.post("/api/bookings", verifyToken, createBooking);
  app.get("/api/bookings", verifyToken, getBookings);

  // Dashboard routes
  app.get("/api/dashboard/stats", verifyToken, requireRole(['admin']), getDashboardStats);

  return app;
}
