/*
  Warnings:

  - You are about to drop the column `product_id` on the `sale_item` table. All the data in the column will be lost.
  - You are about to drop the column `inventory_id` on the `sales` table. All the data in the column will be lost.
  - Added the required column `inventory_Id` to the `sale_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sale_item" DROP CONSTRAINT "sale_item_product_id_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_inventory_id_fkey";

-- AlterTable
ALTER TABLE "sale_item" DROP COLUMN "product_id",
ADD COLUMN     "inventory_Id" TEXT NOT NULL,
ADD COLUMN     "productProduct_id" TEXT;

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "inventory_id";

-- AddForeignKey
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_inventory_Id_fkey" FOREIGN KEY ("inventory_Id") REFERENCES "Inventory"("inventory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_productProduct_id_fkey" FOREIGN KEY ("productProduct_id") REFERENCES "products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;
