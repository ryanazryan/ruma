-- CreateEnum
CREATE TYPE "BrandStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "status" "BrandStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "idx_brands_status" ON "brands"("status");
