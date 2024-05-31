/*
  Warnings:

  - Added the required column `net_price` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "net_price" INTEGER;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "status" "TableStatus" NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "net_price" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'waiting_payment';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "TableStatus" NOT NULL DEFAULT 'Active',
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ShoppingItem" ADD COLUMN     "weight" INTEGER;
