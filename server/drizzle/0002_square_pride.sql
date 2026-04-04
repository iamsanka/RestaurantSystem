ALTER TABLE "order_items" ALTER COLUMN "order_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "menu_item_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "quantity" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "price_at_time" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_number" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "total_amount" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_status" varchar(50) DEFAULT 'unpaid';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "order_source" varchar(50) DEFAULT 'web';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "table_number" varchar(10);