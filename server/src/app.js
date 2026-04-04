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
import menuRoutes from "./routes/menu.js";
import categoriesRoute from "./routes/categories.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/health", healthRouter);

//auth route
app.use("/api/auth", authRouter);
//admin route
app.use("/admin", adminRouter);
//orders
app.use("/api/orders", ordersRoute);
//payments
app.use("/api/payments", paymentsRoute);
//email invoice
app.use("/api/email", emailRoutes);
//menu
app.use("/api/menu", menuRouter);
//categories
app.use("/api/categories", categoriesRoute);

export default app;
