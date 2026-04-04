import express from "express";
import { db } from "../db.js";
import { orders } from "../schema/orders.js";
import { orderItems } from "../schema/orderItems.js";
import { menuItems } from "../schema/menuItems.js";
import { categories } from "../schema/categories.js";
import sendEmail from "../utils/sendEmail.js";
import { desc, eq, sql } from "drizzle-orm";
import { io } from "../../index.js";
import { authRequired, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/* ----------------- helpers ----------------- */

function formatCategoryName(name) {
  if (!name) return "Other";
  const lower = String(name).toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/* Generate next order number */
async function generateOrderNumber() {
  const lastOrder = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.id))
    .limit(1);

  if (lastOrder.length === 0) return "WEB-0001";

  const lastNumber = lastOrder[0].order_number.replace("WEB-", "");
  let next = parseInt(lastNumber) + 1;

  if (next > 9999) next = 1;

  return `WEB-${String(next).padStart(4, "0")}`;
}

/* ----------------------------------------------------
   ⭐ PUBLIC ORDER FETCH FOR CUSTOMERS (NO AUTH)
----------------------------------------------------- */
router.get("/public/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const rawItems = await db
      .select({
        id: orderItems.id,
        item_name: orderItems.item_name,
        quantity: orderItems.quantity,
        price_at_time: orderItems.price_at_time,
        customizations: orderItems.customizations,
        received: orderItems.received,
        category_name: categories.name,
      })
      .from(orderItems)
      .leftJoin(menuItems, eq(orderItems.menu_item_id, menuItems.id))
      .leftJoin(categories, eq(menuItems.category_id, categories.id))
      .where(eq(orderItems.order_id, orderId));

    const items = rawItems.map((item) => ({
      ...item,
      category_name: formatCategoryName(item.category_name),
    }));

    res.json({
      success: true,
      order: order[0],
      items,
    });
  } catch (err) {
    console.error("PUBLIC ORDER FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

/* ----------------------------------------------------
   CREATE ORDER (Customer Checkout) - PUBLIC
----------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      items,
      total_amount,
      payment_method,
      payment_status,
      order_source,
      notes,
      table_number,
    } = req.body;

    const orderNumber = await generateOrderNumber();

    const [newOrder] = await db
      .insert(orders)
      .values({
        order_number: orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        payment_method,
        payment_status,
        order_source,
        notes: notes || null,
        table_number: table_number || null,
        status: "received",
      })
      .returning();

    for (const item of items) {
      await db.insert(orderItems).values({
        order_id: newOrder.id,
        menu_item_id: item.id,
        item_name: item.name,
        quantity: item.qty,
        price_at_time: item.price,
        customizations: item.removedIngredients || [],
        received: false,
      });
    }

    await sendEmail(customer_email, {
      orderNumber,
      items,
      totalAmount: total_amount,
    });

    io.emit("order:new", newOrder);

    res.json({
      success: true,
      orderNumber,
      orderId: newOrder.id,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Order failed" });
  }
});

/* ----------------------------------------------------
   UPDATE ORDER STATUS (Staff/Admin)
   ⭐ UPDATED TO SAVE finalTime FROM FRONTEND
----------------------------------------------------- */
router.put("/:id/status", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, finalTime } = req.body;

    const [existing] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: "Order not found" });
    }

    let updateData = { status };

    if (status === "done") {
      updateData = {
        status,
        preparation_time:
          typeof finalTime === "number" ? finalTime : existing.preparation_time,
      };
    }

    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    io.emit("order:update", updatedOrder);

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("ORDER STATUS UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

/* ----------------------------------------------------
   UPDATE SINGLE ITEM RECEIVED STATE (Staff)
----------------------------------------------------- */
router.patch("/:id/item-received", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId, received } = req.body;

    const [orderRow] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!orderRow) {
      return res.status(404).json({ error: "Order not found" });
    }

    const [updatedItem] = await db
      .update(orderItems)
      .set({ received })
      .where(eq(orderItems.id, itemId))
      .returning();

    if (!updatedItem) {
      return res.status(404).json({ error: "Order item not found" });
    }

    const rawItems = await db
      .select({
        id: orderItems.id,
        item_name: orderItems.item_name,
        quantity: orderItems.quantity,
        price_at_time: orderItems.price_at_time,
        customizations: orderItems.customizations,
        received: orderItems.received,
        category_name: categories.name,
      })
      .from(orderItems)
      .leftJoin(menuItems, eq(orderItems.menu_item_id, menuItems.id))
      .leftJoin(categories, eq(menuItems.category_id, categories.id))
      .where(eq(orderItems.order_id, id));

    const items = rawItems.map((item) => ({
      ...item,
      category_name: formatCategoryName(item.category_name),
    }));

    io.emit("order:item-update", {
      orderId: Number(id),
      items,
    });

    res.json({
      success: true,
      order: orderRow,
      items,
    });
  } catch (err) {
    console.error("ITEM RECEIVED UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update item received state" });
  }
});

/* ----------------------------------------------------
   ADMIN: FETCH ALL ORDERS
----------------------------------------------------- */
router.get("/admin/all", authRequired, isAdmin, async (req, res) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.id));

    res.json({ success: true, orders: allOrders });
  } catch (err) {
    console.error("ADMIN GET ALL ORDERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/* ----------------------------------------------------
   ⭐ ADMIN: SEARCH ORDERS (WITH ITEMS)
----------------------------------------------------- */
router.get("/admin/search", authRequired, isAdmin, async (req, res) => {
  try {
    const { query, date } = req.query;

    let conditions = [];

    if (query) {
      const q = `%${query}%`;
      conditions.push(
        sql`${orders.customer_phone} ILIKE ${q} OR
             ${orders.customer_email} ILIKE ${q} OR
             ${orders.customer_name} ILIKE ${q} OR
             ${orders.order_number} ILIKE ${q}`,
      );
    }

    if (date) {
      conditions.push(sql`DATE(${orders.created_at}) = ${date}`);
    }

    const orderRows = await db
      .select()
      .from(orders)
      .where(
        conditions.length
          ? sql`${sql.join(conditions, sql` AND `)}`
          : undefined,
      )
      .orderBy(desc(orders.id));

    const results = [];

    for (const order of orderRows) {
      const rawItems = await db
        .select({
          id: orderItems.id,
          item_name: orderItems.item_name,
          quantity: orderItems.quantity,
          price_at_time: orderItems.price_at_time,
          customizations: orderItems.customizations,
          received: orderItems.received,
          category_name: categories.name,
        })
        .from(orderItems)
        .leftJoin(menuItems, eq(orderItems.menu_item_id, menuItems.id))
        .leftJoin(categories, eq(menuItems.category_id, categories.id))
        .where(eq(orderItems.order_id, order.id));

      const items = rawItems.map((item) => ({
        ...item,
        category_name: formatCategoryName(item.category_name),
      }));

      results.push({
        ...order,
        items,
      });
    }

    res.json({ success: true, orders: results });
  } catch (err) {
    console.error("ADMIN ORDER SEARCH ERROR:", err);
    res.status(500).json({ error: "Failed to search orders" });
  }
});

/* ----------------------------------------------------
   ADMIN: REVIVE ORDER
----------------------------------------------------- */
router.patch("/admin/:id/revive", authRequired, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [orderRow] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!orderRow) {
      return res.status(404).json({ error: "Order not found" });
    }

    const [revivedOrder] = await db
      .update(orders)
      .set({
        status: "received",
        preparation_time: null,
      })
      .where(eq(orders.id, id))
      .returning();

    await db
      .update(orderItems)
      .set({ received: false })
      .where(eq(orderItems.order_id, id));

    io.emit("order:new", revivedOrder);

    res.json({ success: true, order: revivedOrder });
  } catch (err) {
    console.error("REVIVE ORDER ERROR:", err);
    res.status(500).json({ error: "Failed to revive order" });
  }
});

/* ----------------------------------------------------
   FETCH ORDER BY ID (Staff/Admin)
----------------------------------------------------- */
router.get("/:id", authRequired, async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const rawItems = await db
      .select({
        id: orderItems.id,
        item_name: orderItems.item_name,
        quantity: orderItems.quantity,
        price_at_time: orderItems.price_at_time,
        customizations: orderItems.customizations,
        received: orderItems.received,
        category_name: categories.name,
      })
      .from(orderItems)
      .leftJoin(menuItems, eq(orderItems.menu_item_id, menuItems.id))
      .leftJoin(categories, eq(menuItems.category_id, categories.id))
      .where(eq(orderItems.order_id, orderId));

    const items = rawItems.map((item) => ({
      ...item,
      category_name: formatCategoryName(item.category_name),
    }));

    res.json({
      order: order[0],
      items,
    });
  } catch (err) {
    console.error("FETCH ORDER ERROR:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

/* ----------------------------------------------------
   FETCH ALL ORDERS (Staff/Admin)
----------------------------------------------------- */
router.get("/", authRequired, async (req, res) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.id));

    res.json({ success: true, orders: allOrders });
  } catch (err) {
    console.error("ORDER FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/* ----------------------------------------------------
   STATS: Average prep time (Admin)
----------------------------------------------------- */
router.get(
  "/stats/average-prep-time",
  authRequired,
  isAdmin,
  async (req, res) => {
    try {
      const [row] = await db
        .select({
          avg_prep_time: sql`AVG(${orders.preparation_time})`,
        })
        .from(orders)
        .where(sql`${orders.preparation_time} IS NOT NULL`);

      res.json({
        success: true,
        averagePreparationTimeSeconds: Number(row?.avg_prep_time || 0),
      });
    } catch (err) {
      console.error("AVG PREP TIME ERROR:", err);
      res.status(500).json({ error: "Failed to fetch average prep time" });
    }
  },
);

/* ----------------------------------------------------
   STATS: Orders by status (Admin)
----------------------------------------------------- */
router.get(
  "/stats/orders-by-status",
  authRequired,
  isAdmin,
  async (req, res) => {
    try {
      const rows = await db
        .select({
          status: orders.status,
          count: sql`COUNT(*)`,
        })
        .from(orders)
        .groupBy(orders.status);

      res.json({ success: true, data: rows });
    } catch (err) {
      console.error("ORDERS BY STATUS ERROR:", err);
      res.status(500).json({ error: "Failed to fetch orders by status" });
    }
  },
);

/* ----------------------------------------------------
   STATS: Daily (Admin)
----------------------------------------------------- */
router.get("/stats/daily", authRequired, isAdmin, async (req, res) => {
  try {
    const rows = await db
      .select({
        day: sql`DATE(${orders.created_at})`,
        count: sql`COUNT(*)`,
      })
      .from(orders)
      .groupBy(sql`DATE(${orders.created_at})`)
      .orderBy(sql`DATE(${orders.created_at})`);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("DAILY STATS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch daily stats" });
  }
});

/* ----------------------------------------------------
   STATS: Weekly (Admin)
----------------------------------------------------- */
router.get("/stats/weekly", authRequired, isAdmin, async (req, res) => {
  try {
    const rows = await db
      .select({
        week: sql`DATE_TRUNC('week', ${orders.created_at})`,
        count: sql`COUNT(*)`,
      })
      .from(orders)
      .groupBy(sql`DATE_TRUNC('week', ${orders.created_at})`)
      .orderBy(sql`DATE_TRUNC('week', ${orders.created_at})`);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("WEEKLY STATS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch weekly stats" });
  }
});

export default router;
