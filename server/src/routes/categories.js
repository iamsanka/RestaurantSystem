import express from "express";
import { db } from "../db.js";
import { categories } from "../schema/categories.js";

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const result = await db.select().from(categories);
    res.json({ categories: result });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

export default router;
