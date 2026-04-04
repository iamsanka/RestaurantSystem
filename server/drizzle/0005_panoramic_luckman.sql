ALTER TABLE "menu_items" ADD COLUMN "ingredients" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "customizations" json DEFAULT '[]'::json;