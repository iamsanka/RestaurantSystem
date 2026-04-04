import {
  pgTable,
  serial,
  integer,
  numeric,
  text,
  json,
  boolean, // ⭐ NEW
} from "drizzle-orm/pg-core";

import { orders } from "./orders.js";

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id),
  menu_item_id: integer("menu_item_id"),

  item_name: text("item_name").notNull(),
  quantity: integer("quantity").notNull(),
  price_at_time: numeric("price_at_time").notNull(),

  // existing JSON column
  customizations: json("customizations").$type([]).default([]),

  // ⭐ NEW: track if this item has been received by front staff
  received: boolean("received").notNull().default(false),
});
