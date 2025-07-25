/*
  Warnings:

  - Added the required column `inventory_id` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "inventory_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("inventory_id") ON DELETE RESTRICT ON UPDATE CASCADE;
