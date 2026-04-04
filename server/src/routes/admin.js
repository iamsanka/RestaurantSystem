import { Router } from "express";
import { db } from "../db.js";
import { users } from "../schema/users.js";
import { hashPassword } from "../utils/auth.js";
import { authRequired, isAdmin } from "../middleware/auth.js";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * CREATE STAFF USER
 * POST /admin/staff
 */
router.post("/staff", authRequired, isAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const hashed = await hashPassword(password);

    await db.insert(users).values({
      name,
      email,
      password: hashed,
      phone,
      role: role || "staff",
    });

    res.json({ success: true, message: "Staff account created" });
  } catch (err) {
    console.error("CREATE STAFF ERROR:", err);
    res.status(500).json({ error: "Failed to create staff" });
  }
});

/**
 * GET ALL STAFF
 * GET /admin/staff
 */
router.get("/staff", authRequired, isAdmin, async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (err) {
    console.error("GET STAFF ERROR:", err);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

/**
 * UPDATE STAFF
 * PUT /admin/staff/:id
 */
router.put("/staff/:id", authRequired, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;
    const { id } = req.params;

    const updateData = { name, email, phone, role };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));

    res.json({ success: true, message: "Staff updated" });
  } catch (err) {
    console.error("UPDATE STAFF ERROR:", err);
    res.status(500).json({ error: "Failed to update staff" });
  }
});

/**
 * DEACTIVATE STAFF (soft delete)
 * DELETE /admin/staff/:id
 */
router.delete("/staff/:id", authRequired, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await db.update(users).set({ role: "inactive" }).where(eq(users.id, id));

    res.json({ success: true, message: "Staff deactivated" });
  } catch (err) {
    console.error("DEACTIVATE STAFF ERROR:", err);
    res.status(500).json({ error: "Failed to deactivate staff" });
  }
});

/**
 * ACTIVATE STAFF
 * PATCH /admin/staff/:id/activate
 */
router.patch("/staff/:id/activate", authRequired, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await db.update(users).set({ role: "staff" }).where(eq(users.id, id));

    res.json({ success: true, message: "Staff activated" });
  } catch (err) {
    console.error("ACTIVATE STAFF ERROR:", err);
    res.status(500).json({ error: "Failed to activate staff" });
  }
});

/**
 * PERMANENT DELETE STAFF
 * DELETE /admin/staff/:id/delete
 */
router.delete("/staff/:id/delete", authRequired, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(users).where(eq(users.id, id));

    res.json({ success: true, message: "Staff permanently deleted" });
  } catch (err) {
    console.error("DELETE STAFF ERROR:", err);
    res.status(500).json({ error: "Failed to delete staff" });
  }
});

export default router;
