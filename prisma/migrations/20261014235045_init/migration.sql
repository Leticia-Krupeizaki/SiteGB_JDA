-- CreateEnum
CREATE TYPE "MuralStatus" AS ENUM ('PENDING', 'AWAITING_GUARDIAN_AUTHORIZATION', 'APPROVED', 'REJECTED', 'REMOVED');

-- CreateEnum
CREATE TYPE "MuralCategory" AS ENUM ('TREINOS', 'GRADUACOES', 'CAMPEONATOS', 'EVENTOS', 'COMUNIDADE');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('WHATSAPP', 'EMAIL');

-- CreateEnum
CREATE TYPE "GuardianAuthorizationStatus" AS ENUM ('NOT_EVALUATED', 'NOT_REQUIRED', 'REQUIRED_PENDING', 'RECEIVED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "ModerationAction" AS ENUM ('SUBMITTED', 'AWAITING_GUARDIAN', 'APPROVED', 'REJECTED', 'REMOVED', 'NOTE');

-- CreateEnum
CREATE TYPE "RemovalRequestStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "providerId" TEXT,
    "role" "AdminRole" NOT NULL DEFAULT 'MODERATOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuralPost" (
    "id" UUID NOT NULL,
    "studentName" TEXT NOT NULL,
    "contactType" "ContactType" NOT NULL,
    "contactValue" TEXT NOT NULL,
    "caption" TEXT,
    "category" "MuralCategory" NOT NULL,
    "status" "MuralStatus" NOT NULL DEFAULT 'PENDING',
    "showNamePublicly" BOOLEAN NOT NULL DEFAULT false,
    "showCaptionPublicly" BOOLEAN NOT NULL DEFAULT false,
    "originalObjectKey" TEXT NOT NULL,
    "publicObjectKey" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "privacyPolicyVersion" TEXT NOT NULL,
    "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
    "publicationConsentVersion" TEXT NOT NULL,
    "publicationConsentAt" TIMESTAMP(3) NOT NULL,
    "guardianAuthorizationStatus" "GuardianAuthorizationStatus" NOT NULL DEFAULT 'NOT_EVALUATED',
    "thirdPartyRightsReviewed" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "moderatedById" UUID,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removedAt" TIMESTAMP(3),

    CONSTRAINT "MuralPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuralModerationEvent" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "adminId" UUID,
    "action" "ModerationAction" NOT NULL,
    "previousStatus" "MuralStatus",
    "nextStatus" "MuralStatus",
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuralModerationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuralRemovalRequest" (
    "id" UUID NOT NULL,
    "postId" UUID,
    "requesterContact" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "RemovalRequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolutionNote" TEXT,

    CONSTRAINT "MuralRemovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitHit" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitHit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_providerId_key" ON "Admin"("providerId");

-- CreateIndex
CREATE INDEX "MuralPost_status_createdAt_idx" ON "MuralPost"("status", "createdAt");

-- CreateIndex
CREATE INDEX "MuralPost_category_status_createdAt_idx" ON "MuralPost"("category", "status", "createdAt");

-- CreateIndex
CREATE INDEX "MuralPost_status_approvedAt_idx" ON "MuralPost"("status", "approvedAt");

-- CreateIndex
CREATE INDEX "MuralPost_category_status_approvedAt_idx" ON "MuralPost"("category", "status", "approvedAt");

-- CreateIndex
CREATE INDEX "MuralModerationEvent_postId_createdAt_idx" ON "MuralModerationEvent"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "MuralRemovalRequest_status_createdAt_idx" ON "MuralRemovalRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitHit_key_createdAt_idx" ON "RateLimitHit"("key", "createdAt");

-- AddForeignKey
ALTER TABLE "MuralPost" ADD CONSTRAINT "MuralPost_moderatedById_fkey" FOREIGN KEY ("moderatedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuralModerationEvent" ADD CONSTRAINT "MuralModerationEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "MuralPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuralModerationEvent" ADD CONSTRAINT "MuralModerationEvent_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuralRemovalRequest" ADD CONSTRAINT "MuralRemovalRequest_postId_fkey" FOREIGN KEY ("postId") REFERENCES "MuralPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
