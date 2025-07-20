-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_last_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_user_id_fkey";

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_last_updated_by_id_fkey" FOREIGN KEY ("last_updated_by_id") REFERENCES "users"("user_id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
