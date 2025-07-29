/*
  Warnings:

  - You are about to drop the column `inventory_Id` on the `sale_item` table. All the data in the column will be lost.
  - Added the required column `inventory_id` to the `sale_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sale_item" DROP CONSTRAINT "sale_item_inventory_Id_fkey";

-- AlterTable
ALTER TABLE "sale_item" DROP COLUMN "inventory_Id",
ADD COLUMN     "inventory_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("inventory_id") ON DELETE RESTRICT ON UPDATE CASCADE;
