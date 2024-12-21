-- AlterTable
ALTER TABLE "AppIdea" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "AppIdea_order_idx" ON "AppIdea"("order");
