import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  json, // ⭐ REQUIRED FOR JSON COLUMNS
} from "drizzle-orm/pg-core";

import { categories } from "./categories.js";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  // ⭐ FIXED JSON COLUMN
  ingredients: json("ingredients").$type([]).default([]),

  category_id: integer("category_id")
    .notNull()
    .references(() => categories.id),

  price: integer("price").notNull(),
  imageUrl: text("image_url"),

  isAvailable: boolean("is_available").default(true),

  // ⭐ NEW FIELDS
  isNew: boolean("is_new").default(false),
  isPopular: boolean("is_popular").default(false),

  createdAt: timestamp("created_at").defaultNow(),
});
