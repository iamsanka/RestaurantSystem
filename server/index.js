import app from "./src/app.js";
import dotenv from "dotenv";
import { testConnection } from "./src/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./src/routes/auth.js";

dotenv.config();

// Railway injects PORT automatically
const PORT = process.env.PORT || 5001;

// ⭐ MOUNT ROUTES BEFORE CREATING SERVER
app.use("/api/auth", authRoutes);

// Create HTTP server AFTER routes are mounted
const httpServer = createServer(app);

// Attach Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("Staff connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Staff disconnected:", socket.id);
  });
});

// ⭐ IMPORTANT: Bind to 0.0.0.0 for Railway
httpServer.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);
  await testConnection();
});
