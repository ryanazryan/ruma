-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('NON_MEMBER', 'MEMBER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "membership_activated_at" TIMESTAMPTZ(6),
ADD COLUMN     "membership_status" "MembershipStatus" NOT NULL DEFAULT 'NON_MEMBER';
