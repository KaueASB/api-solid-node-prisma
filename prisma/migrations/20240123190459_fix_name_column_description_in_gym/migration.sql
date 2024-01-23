/*
  Warnings:

  - You are about to drop the column `decription` on the `gyms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "decription",
ADD COLUMN     "description" TEXT;
