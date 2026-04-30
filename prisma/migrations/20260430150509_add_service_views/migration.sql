-- AlterTable
ALTER TABLE "services" ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "service_views" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_views_serviceId_idx" ON "service_views"("serviceId");

-- CreateIndex
CREATE INDEX "service_views_viewedAt_idx" ON "service_views"("viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "service_views_serviceId_fingerprint_key" ON "service_views"("serviceId", "fingerprint");

-- AddForeignKey
ALTER TABLE "service_views" ADD CONSTRAINT "service_views_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
