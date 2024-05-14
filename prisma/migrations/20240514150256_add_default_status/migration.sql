/*
  Warnings:

  - Added the required column `net_price` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "net_price" INTEGER;

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "net_price" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'waiting_payment';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT;
