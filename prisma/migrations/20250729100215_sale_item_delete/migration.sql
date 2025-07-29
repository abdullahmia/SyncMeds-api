-- DropForeignKey
ALTER TABLE "sale_item" DROP CONSTRAINT "sale_item_sale_id_fkey";

-- AddForeignKey
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("sale_id") ON DELETE CASCADE ON UPDATE CASCADE;
