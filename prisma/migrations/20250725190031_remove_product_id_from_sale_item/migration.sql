/*
  Warnings:

  - You are about to drop the column `product_id` on the `sale_item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sale_item" DROP CONSTRAINT "sale_item_product_id_fkey";

-- AlterTable
ALTER TABLE "sale_item" DROP COLUMN "product_id",
ADD COLUMN     "productProduct_id" TEXT;

-- AddForeignKey
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_productProduct_id_fkey" FOREIGN KEY ("productProduct_id") REFERENCES "products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;
