/*
  Warnings:

  - You are about to drop the column `buttonText` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `buyLink` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Book` table. All the data in the column will be lost.
  - Added the required column `coverImage` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Made the column `fileUrl` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('BUY', 'READ', 'EXTERNAL');

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "buttonText",
DROP COLUMN "buyLink",
DROP COLUMN "coverUrl",
ADD COLUMN     "coverImage" TEXT NOT NULL,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "externalLink" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "linkType" "LinkType" NOT NULL DEFAULT 'BUY',
ALTER COLUMN "fileUrl" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- CreateIndex
CREATE INDEX "Book_createdBy_idx" ON "Book"("createdBy");
