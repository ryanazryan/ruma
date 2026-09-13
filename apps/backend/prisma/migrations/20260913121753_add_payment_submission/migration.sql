-- CreateEnum
CREATE TYPE "PaymentSubmissionStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'MANUAL_BANK_TRANSFER';

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "provider" DROP NOT NULL,
ALTER COLUMN "provider" DROP DEFAULT;

-- CreateTable
CREATE TABLE "payment_submissions" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "sender_bank" VARCHAR(100) NOT NULL,
    "sender_name" VARCHAR(100) NOT NULL,
    "transfer_amount" INTEGER NOT NULL,
    "transferred_at" TIMESTAMPTZ(6) NOT NULL,
    "proof_url" TEXT NOT NULL,
    "ocr_data" JSONB,
    "submitted_data" JSONB,
    "status" "PaymentSubmissionStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "rejection_reason" TEXT,
    "verified_by_user_id" UUID,
    "verified_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_payment_submissions_payment_id" ON "payment_submissions"("payment_id");

-- CreateIndex
CREATE INDEX "idx_payment_submissions_status" ON "payment_submissions"("status");

-- CreateIndex
CREATE INDEX "idx_payment_submissions_created_at" ON "payment_submissions"("created_at");

-- CreateIndex
CREATE INDEX "idx_payment_submissions_verified_by" ON "payment_submissions"("verified_by_user_id");

-- AddForeignKey
ALTER TABLE "payment_submissions" ADD CONSTRAINT "payment_submissions_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_submissions" ADD CONSTRAINT "payment_submissions_verified_by_user_id_fkey" FOREIGN KEY ("verified_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
