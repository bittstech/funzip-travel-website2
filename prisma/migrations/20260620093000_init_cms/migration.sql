CREATE TYPE "MediaAssetType" AS ENUM ('HERO', 'GALLERY', 'PACKAGE', 'BLOG', 'OG_IMAGE', 'GENERAL');

CREATE TABLE "SiteSettings" (
  "id" TEXT NOT NULL,
  "siteName" TEXT NOT NULL DEFAULT 'Funzip Kashmir Tour & Travels',
  "siteUrl" TEXT NOT NULL DEFAULT 'https://funzip.travel',
  "logoUrl" TEXT,
  "phonePrimary" TEXT,
  "phoneSecondary" TEXT,
  "whatsappNumber" TEXT,
  "email" TEXT,
  "address" TEXT,
  "googleReviewUrl" TEXT,
  "tripAdvisorUrl" TEXT,
  "defaultMetaTitle" TEXT,
  "defaultMetaDescription" TEXT,
  "defaultOgImage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL,
  "originalFileName" TEXT NOT NULL,
  "altText" TEXT,
  "caption" TEXT,
  "storageUrl" TEXT NOT NULL,
  "variantsJson" JSONB,
  "width" INTEGER NOT NULL,
  "height" INTEGER NOT NULL,
  "format" TEXT NOT NULL,
  "sizeKb" INTEGER NOT NULL,
  "type" "MediaAssetType" NOT NULL DEFAULT 'GENERAL',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HeroSlide" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "imageId" TEXT NOT NULL,
  "mobileImageId" TEXT,
  "ctaText" TEXT,
  "ctaUrl" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GalleryImage" (
  "id" TEXT NOT NULL,
  "imageId" TEXT NOT NULL,
  "title" TEXT,
  "location" TEXT,
  "altText" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Package" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "fullDescription" TEXT,
  "location" TEXT,
  "duration" TEXT,
  "priceStartingFrom" INTEGER,
  "coverImageId" TEXT,
  "galleryImageIds" JSONB NOT NULL DEFAULT '[]',
  "inclusions" JSONB NOT NULL DEFAULT '[]',
  "exclusions" JSONB NOT NULL DEFAULT '[]',
  "itineraryJson" JSONB NOT NULL DEFAULT '[]',
  "faqsJson" JSONB NOT NULL DEFAULT '[]',
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "ogImageId" TEXT,
  "canonicalUrl" TEXT,
  "keywords" JSONB NOT NULL DEFAULT '[]',
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Blog" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content" TEXT,
  "coverImageId" TEXT,
  "authorName" TEXT,
  "category" TEXT,
  "tags" JSONB NOT NULL DEFAULT '[]',
  "faqsJson" JSONB NOT NULL DEFAULT '[]',
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "ogImageId" TEXT,
  "canonicalUrl" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "travelLocation" TEXT,
  "numberOfPeople" INTEGER,
  "sourcePage" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "message" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Package_slug_key" ON "Package"("slug");
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");
CREATE INDEX "MediaAsset_type_isActive_idx" ON "MediaAsset"("type", "isActive");
CREATE INDEX "HeroSlide_isActive_sortOrder_idx" ON "HeroSlide"("isActive", "sortOrder");
CREATE INDEX "GalleryImage_isActive_sortOrder_idx" ON "GalleryImage"("isActive", "sortOrder");
CREATE INDEX "Package_isPublished_isFeatured_idx" ON "Package"("isPublished", "isFeatured");
CREATE INDEX "Package_publishedAt_idx" ON "Package"("publishedAt");
CREATE INDEX "Blog_isPublished_publishedAt_idx" ON "Blog"("isPublished", "publishedAt");
CREATE INDEX "Blog_category_idx" ON "Blog"("category");
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE INDEX "Lead_sourceType_idx" ON "Lead"("sourceType");

ALTER TABLE "HeroSlide" ADD CONSTRAINT "HeroSlide_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "HeroSlide" ADD CONSTRAINT "HeroSlide_mobileImageId_fkey" FOREIGN KEY ("mobileImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Package" ADD CONSTRAINT "Package_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Package" ADD CONSTRAINT "Package_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_ogImageId_fkey" FOREIGN KEY ("ogImageId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
