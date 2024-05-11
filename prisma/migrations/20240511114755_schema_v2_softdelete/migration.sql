-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "deleted_at" TIMESTAMP(3);
