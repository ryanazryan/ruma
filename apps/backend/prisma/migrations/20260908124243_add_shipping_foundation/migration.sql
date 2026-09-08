-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'BOOKED', 'PICKING_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'FAILED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discount_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shipping_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal_amount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "height_cm" INTEGER,
ADD COLUMN     "length_cm" INTEGER,
ADD COLUMN     "weight_gram" INTEGER,
ADD COLUMN     "width_cm" INTEGER;

UPDATE "orders" o
SET
    "subtotal_amount" = COALESCE(
        (
            SELECT SUM(oi."subtotal")
            FROM "order_items" oi
            WHERE oi."order_id" = o."id"
        ),
        0
    ),
    "shipping_amount" = GREATEST(
        o."total_amount" - COALESCE(
            (
                SELECT SUM(oi."subtotal")
                FROM "order_items" oi
                WHERE oi."order_id" = o."id"
            ),
            0
        ),
        0
    );

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "external_order_id" VARCHAR(100),
    "courier_code" VARCHAR(50),
    "courier_name" VARCHAR(100),
    "service_code" VARCHAR(50),
    "service_name" VARCHAR(100),
    "tracking_number" VARCHAR(100),
    "shipping_cost" INTEGER NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "label_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipments_order_id_key" ON "shipments"("order_id");

-- CreateIndex
CREATE INDEX "idx_shipments_status" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "idx_shipments_tracking_number" ON "shipments"("tracking_number");

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
