/*
  Warnings:

  - You are about to drop the column `total_item` on the `sale_item` table. All the data in the column will be lost.
  - Added the required column `total_amount` to the `sale_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sale_item" DROP COLUMN "total_item",
ADD COLUMN     "total_amount" INTEGER NOT NULL;
