/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `defaultProjectId` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `testMode` on the `UserSettings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "createdAt",
DROP COLUMN "defaultProjectId",
DROP COLUMN "testMode",
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'de',
ALTER COLUMN "sidebarPosition" SET DEFAULT 'links',
ALTER COLUMN "theme" SET DEFAULT 'dark';

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
