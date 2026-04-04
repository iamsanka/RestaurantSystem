import app from "./src/app.js";
import dotenv from "dotenv";
import { testConnection } from "./src/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

// ⭐ ADD THIS
import authRoutes from "./src/routes/auth.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

// Create HTTP server
const httpServer = createServer(app);

// ⭐ MOUNT AUTH ROUTES
app.use("/api/auth", authRoutes);

// Attach Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.io connection event
io.on("connection", (socket) => {
  console.log("Staff connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Staff disconnected:", socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  testConnection();
});
