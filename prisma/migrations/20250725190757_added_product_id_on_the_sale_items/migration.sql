/*
  Warnings:

  - You are about to drop the column `productProduct_id` on the `sale_item` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `sale_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sale_item" DROP CONSTRAINT "sale_item_productProduct_id_fkey";

-- AlterTable
ALTER TABLE "sale_item" DROP COLUMN "productProduct_id",
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
