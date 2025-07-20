-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_last_updated_by_id_fkey";

-- AlterTable
ALTER TABLE "Settings" ALTER COLUMN "last_updated_by_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sales" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_last_updated_by_id_fkey" FOREIGN KEY ("last_updated_by_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
