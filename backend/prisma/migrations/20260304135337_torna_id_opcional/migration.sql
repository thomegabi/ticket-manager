/*
  Warnings:

  - Added the required column `openedByName` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_openedById_fkey";

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "openedByName" TEXT NOT NULL,
ALTER COLUMN "openedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
