/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "deleted_at",
ADD COLUMN     "status" "TableStatus" NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "deleted_at",
ADD COLUMN     "status" "TableStatus" NOT NULL DEFAULT 'Active';
