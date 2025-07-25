/*
  Warnings:

  - You are about to drop the column `quantity_sold` on the `sale_item` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `sale_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sale_item" DROP COLUMN "quantity_sold",
ADD COLUMN     "quantity" INTEGER NOT NULL;
