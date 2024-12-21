-- DropIndex
DROP INDEX "Subtask_ideaId_idx";

-- DropIndex
DROP INDEX "Subtask_order_idx";

-- AlterTable
ALTER TABLE "Subtask" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "order" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Subtask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
