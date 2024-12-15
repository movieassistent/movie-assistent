-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "displayMode" TEXT NOT NULL DEFAULT 'window',
ADD COLUMN     "fullscreenOnLogin" BOOLEAN NOT NULL DEFAULT false;
