-- CreateEnum
CREATE TYPE "AppIdeaStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'IMPLEMENTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "AppIdea" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "AppIdeaStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "implementedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,

    CONSTRAINT "AppIdea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppIdea" ADD CONSTRAINT "AppIdea_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
