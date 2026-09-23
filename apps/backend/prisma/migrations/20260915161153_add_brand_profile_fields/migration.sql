-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "cover_image_public_id" TEXT,
ADD COLUMN     "cover_image_url" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "origin" VARCHAR(150),
ADD COLUMN     "tagline" VARCHAR(200);

-- CreateIndex
CREATE INDEX "idx_brands_featured" ON "brands"("featured");
