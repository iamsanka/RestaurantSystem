import {
  pgTable,
  serial,
  varchar,
  numeric,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),

  order_number: varchar("order_number", { length: 20 }).notNull().unique(),

  customer_name: varchar("customer_name", { length: 255 }),
  customer_email: varchar("customer_email", { length: 255 }),
  customer_phone: varchar("customer_phone", { length: 20 }),

  total_amount: numeric("total_amount").notNull(),

  payment_method: varchar("payment_method", { length: 50 }).notNull(),
  payment_status: varchar("payment_status", { length: 50 }).default("unpaid"),
  order_source: varchar("order_source", { length: 50 }).default("web"),

  notes: text("notes"),
  table_number: varchar("table_number", { length: 10 }),

  status: varchar("status", { length: 50 }).default("received"),

  created_at: timestamp("created_at").defaultNow(),

  // ⭐ NEW COLUMN — total seconds from received → done
  preparation_time: integer("preparation_time"),
});
