import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import ordersRoute from "./routes/orders.js";
import paymentsRoute from "./routes/payments.js";
import emailRoutes from "./routes/email.js";
import menuRouter from "./routes/menu.js";
import categoriesRoute from "./routes/categories.js";

dotenv.config();

const app = express();

/* ---------------------------------------------
   ⭐ FIXED CORS FOR PRODUCTION
---------------------------------------------- */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL, // your Vercel domain
    ],
    credentials: true,
  }),
);

/* ---------------------------------------------
   ⭐ TRUST PROXY (Railway HTTPS)
---------------------------------------------- */
app.set("trust proxy", 1);

app.use(express.json());

// Routes
app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/api/orders", ordersRoute);
app.use("/api/payments", paymentsRoute);
app.use("/api/email", emailRoutes);
app.use("/api/menu", menuRouter);
app.use("/api/categories", categoriesRoute);

export default app;
