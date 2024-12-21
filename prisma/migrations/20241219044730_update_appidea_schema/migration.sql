/*
  Warnings:

  - The values [OPEN,IMPLEMENTED] on the enum `AppIdeaStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `priority` column on the `AppIdea` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterEnum
BEGIN;
CREATE TYPE "AppIdeaStatus_new" AS ENUM ('SUBMITTED', 'ACCEPTED', 'IN_PROGRESS', 'DONE', 'REJECTED');
ALTER TABLE "AppIdea" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "AppIdea" ALTER COLUMN "status" TYPE "AppIdeaStatus_new" USING ("status"::text::"AppIdeaStatus_new");
ALTER TYPE "AppIdeaStatus" RENAME TO "AppIdeaStatus_old";
ALTER TYPE "AppIdeaStatus_new" RENAME TO "AppIdeaStatus";
DROP TYPE "AppIdeaStatus_old";
ALTER TABLE "AppIdea" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';
COMMIT;

-- AlterTable
ALTER TABLE "AppIdea" ADD COLUMN     "aiTasks" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "category" TEXT,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
ALTER COLUMN "status" SET DEFAULT 'SUBMITTED',
DROP COLUMN "priority",
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 3;

-- DropEnum
DROP TYPE "Priority";

-- CreateIndex
CREATE INDEX "AppIdea_visibility_idx" ON "AppIdea"("visibility");

-- CreateIndex
CREATE INDEX "AppIdea_status_idx" ON "AppIdea"("status");
