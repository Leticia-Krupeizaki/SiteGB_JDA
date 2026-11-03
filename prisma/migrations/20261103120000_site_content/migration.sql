-- CreateTable
CREATE TABLE "SiteImage" (
    "slot" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "alt" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "SiteImage_pkey" PRIMARY KEY ("slot")
);

-- CreateTable
CREATE TABLE "CurriculumPoster" (
    "slug" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "referenceMonth" TEXT,
    "fullKey" TEXT NOT NULL,
    "fullWidth" INTEGER NOT NULL,
    "fullHeight" INTEGER NOT NULL,
    "previewKey" TEXT NOT NULL,
    "previewWidth" INTEGER NOT NULL,
    "previewHeight" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" UUID,

    CONSTRAINT "CurriculumPoster_pkey" PRIMARY KEY ("slug")
);

-- AddForeignKey
ALTER TABLE "SiteImage" ADD CONSTRAINT "SiteImage_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPoster" ADD CONSTRAINT "CurriculumPoster_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
