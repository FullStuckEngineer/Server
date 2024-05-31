/*
  Warnings:

  - Added the required column `net_price` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/


-- AlterTable
ALTER TABLE "User" ADD COLUMN "photo" TEXT;
