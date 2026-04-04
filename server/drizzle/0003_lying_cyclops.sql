ALTER TABLE "order_items" DROP CONSTRAINT "order_items_menu_item_id_menu_items_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "item_name" text NOT NULL;