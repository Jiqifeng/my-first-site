-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ImageStatus" NOT NULL DEFAULT 'DRAFT',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "uploadedById" TEXT NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- Add album columns to ImageItem
ALTER TABLE "ImageItem" ADD COLUMN "albumId" TEXT;
ALTER TABLE "ImageItem" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Migrate existing single-image items into one album each (preserve album id = old image id for URL compatibility)
INSERT INTO "Album" ("id", "title", "description", "status", "uploadedAt", "createdAt", "updatedAt", "publishedAt", "uploadedById")
SELECT "id", "title", "description", "status", "uploadedAt", "createdAt", "updatedAt", "publishedAt", "uploadedById"
FROM "ImageItem";

UPDATE "ImageItem" SET "albumId" = "id";

ALTER TABLE "ImageItem" ALTER COLUMN "albumId" SET NOT NULL;

-- Drop legacy ImageItem metadata columns (now on Album)
ALTER TABLE "ImageItem" DROP COLUMN "title";
ALTER TABLE "ImageItem" DROP COLUMN "description";
ALTER TABLE "ImageItem" DROP COLUMN "status";
ALTER TABLE "ImageItem" DROP COLUMN "publishedAt";
ALTER TABLE "ImageItem" DROP COLUMN "uploadedById";

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ImageItem" ADD CONSTRAINT "ImageItem_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
