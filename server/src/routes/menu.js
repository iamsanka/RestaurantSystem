import express from "express";
import { db } from "../db.js";
import { menuItems } from "../schema/menuItems.js";
import { categories } from "../schema/categories.js";
import { eq } from "drizzle-orm";
import { authRequired, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/* ----------------------------------------------------
   GET ALL MENU ITEMS (Public + Admin)
----------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const items = await db
      .select({
        id: menuItems.id,
        name: menuItems.name,
        description: menuItems.description,
        price: menuItems.price,
        imageUrl: menuItems.imageUrl,
        isAvailable: menuItems.isAvailable,
        isNew: menuItems.isNew,
        isPopular: menuItems.isPopular,
        category: categories.name,
        category_id: categories.id,
        ingredients: menuItems.ingredients,
      })
      .from(menuItems)
      .leftJoin(categories, eq(menuItems.category_id, categories.id));

    const safeItems = items.map((i) => {
      let ingredients = i.ingredients;

      if (typeof ingredients === "string") {
        try {
          ingredients = JSON.parse(ingredients);
        } catch {
          ingredients = [];
        }
      }

      if (!Array.isArray(ingredients)) {
        ingredients = [];
      }

      return { ...i, ingredients };
    });

    res.json({ success: true, items: safeItems });
  } catch (error) {
    console.error("MENU FETCH ERROR:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

/* ----------------------------------------------------
   CREATE MENU ITEM (Admin Only)
----------------------------------------------------- */
router.post("/", authRequired, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      category_id,
      ingredients,
      isNew = false,
      isPopular = false,
    } = req.body;

    const parsedIngredients = Array.isArray(ingredients) ? ingredients : [];

    const [newItem] = await db
      .insert(menuItems)
      .values({
        name,
        description,
        price,
        imageUrl,
        category_id,
        isAvailable: true,
        isNew,
        isPopular,
        ingredients: JSON.stringify(parsedIngredients),
      })
      .returning();

    req.io?.emit("menu:update", newItem);

    res.json({ success: true, item: newItem });
  } catch (error) {
    console.error("MENU CREATE ERROR:", error);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

/* ----------------------------------------------------
   UPDATE MENU ITEM (Admin Only)
----------------------------------------------------- */
router.put("/:id", authRequired, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      imageUrl,
      category_id,
      ingredients,
      isNew,
      isPopular,
    } = req.body;

    const parsedIngredients = Array.isArray(ingredients) ? ingredients : [];

    const [updated] = await db
      .update(menuItems)
      .set({
        name,
        description,
        price,
        imageUrl,
        category_id,
        isNew,
        isPopular,
        ingredients: JSON.stringify(parsedIngredients),
      })
      .where(eq(menuItems.id, Number(id))) // ← FIXED
      .returning();

    req.io?.emit("menu:update", updated);

    res.json({ success: true, item: updated });
  } catch (error) {
    console.error("MENU UPDATE ERROR:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

/* ----------------------------------------------------
   DELETE MENU ITEM (Admin Only)
----------------------------------------------------- */
router.delete("/:id", authRequired, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(menuItems).where(eq(menuItems.id, Number(id))); // ← FIXED

    req.io?.emit("menu:update", { id, deleted: true });

    res.json({ success: true });
  } catch (error) {
    console.error("MENU DELETE ERROR:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

/* ----------------------------------------------------
   TOGGLE AVAILABILITY (Admin Only)
----------------------------------------------------- */
router.patch("/:id/toggle", authRequired, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [item] = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, Number(id))) // ← FIXED
      .limit(1);

    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const [updated] = await db
      .update(menuItems)
      .set({ isAvailable: !item.isAvailable })
      .where(eq(menuItems.id, Number(id))) // ← FIXED
      .returning();

    req.io?.emit("menu:update", updated);

    res.json({ success: true, item: updated });
  } catch (error) {
    console.error("MENU TOGGLE ERROR:", error);
    res.status(500).json({ error: "Failed to toggle availability" });
  }
});

/* ----------------------------------------------------
   TOGGLE NEW (Admin Only)
----------------------------------------------------- */
router.patch("/:id/new", authRequired, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [item] = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, Number(id))) // ← FIXED
      .limit(1);

    const [updated] = await db
      .update(menuItems)
      .set({ isNew: !item.isNew })
      .where(eq(menuItems.id, Number(id))) // ← FIXED
      .returning();

    req.io?.emit("menu:update", updated);

    res.json({ success: true, item: updated });
  } catch (error) {
    console.error("MENU NEW TOGGLE ERROR:", error);
    res.status(500).json({ error: "Failed to toggle NEW status" });
  }
});

/* ----------------------------------------------------
   TOGGLE POPULAR (Admin Only)
----------------------------------------------------- */
router.patch("/:id/popular", authRequired, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [item] = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, Number(id))) // ← FIXED
      .limit(1);

    const [updated] = await db
      .update(menuItems)
      .set({ isPopular: !item.isPopular })
      .where(eq(menuItems.id, Number(id))) // ← FIXED
      .returning();

    req.io?.emit("menu:update", updated);

    res.json({ success: true, item: updated });
  } catch (error) {
    console.error("MENU POPULAR TOGGLE ERROR:", error);
    res.status(500).json({ error: "Failed to toggle POPULAR status" });
  }
});

export default router;
