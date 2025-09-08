-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('RIVIAN', 'SCOUT');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('NEWS', 'RUMOR', 'BLOG', 'OFFICIAL_UPDATE', 'REVIEW', 'ANALYSIS');

-- CreateEnum
CREATE TYPE "ChangeType" AS ENUM ('CREATED', 'UPDATED', 'DELETED', 'CONTENT_CHANGED', 'TITLE_CHANGED', 'CATEGORY_CHANGED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('RIVIAN_SUPPORT', 'NEWS_SCRAPE', 'STAGING_DISCOVERY', 'CONTENT_UPDATE');

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" "ArticleCategory" NOT NULL,
    "brand" "Brand" NOT NULL,
    "tags" TEXT[],
    "isStaging" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "featuredImage" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "brand" "Brand" NOT NULL,
    "category" TEXT,
    "isStaging" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_changes" (
    "id" TEXT NOT NULL,
    "supportArticleId" TEXT NOT NULL,
    "changeType" "ChangeType" NOT NULL,
    "oldContent" TEXT,
    "newContent" TEXT,
    "oldTitle" TEXT,
    "newTitle" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraping_jobs" (
    "id" TEXT NOT NULL,
    "jobType" "JobType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraping_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_url_key" ON "articles"("url");

-- CreateIndex
CREATE UNIQUE INDEX "support_articles_url_key" ON "support_articles"("url");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "articles_brand_idx" ON "articles"("brand");

-- CreateIndex
CREATE INDEX "articles_isStaging_idx" ON "articles"("isStaging");

-- CreateIndex
CREATE INDEX "support_articles_lastUpdated_idx" ON "support_articles"("lastUpdated");

-- CreateIndex
CREATE INDEX "support_articles_brand_idx" ON "support_articles"("brand");

-- CreateIndex
CREATE INDEX "support_articles_isStaging_idx" ON "support_articles"("isStaging");

-- CreateIndex
CREATE INDEX "content_changes_detectedAt_idx" ON "content_changes"("detectedAt");

-- CreateIndex
CREATE INDEX "scraping_jobs_createdAt_idx" ON "scraping_jobs"("createdAt");

-- CreateIndex
CREATE INDEX "scraping_jobs_status_idx" ON "scraping_jobs"("status");

-- AddForeignKey
ALTER TABLE "content_changes" ADD CONSTRAINT "content_changes_supportArticleId_fkey" FOREIGN KEY ("supportArticleId") REFERENCES "support_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
