-- AlterTable
ALTER TABLE "ImageItem"
ADD COLUMN "hdImageUrl" TEXT,
ADD COLUMN "previewUrl" TEXT,
ADD COLUMN "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill from legacy imageUrl when available
UPDATE "ImageItem"
SET "hdImageUrl" = COALESCE("hdImageUrl", "imageUrl"),
    "previewUrl" = COALESCE("previewUrl", "imageUrl");

-- Make new columns required
ALTER TABLE "ImageItem"
ALTER COLUMN "hdImageUrl" SET NOT NULL,
ALTER COLUMN "previewUrl" SET NOT NULL;

-- Drop legacy column
ALTER TABLE "ImageItem" DROP COLUMN "imageUrl";
