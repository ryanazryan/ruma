import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { ShippingService } from '../shipping/shipping.service';
import { PlaceOrderDto } from './dto/place-order.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService,
    private readonly shippingService: ShippingService,
  ) {}

  async getSummary(userId: string, addressId: string) {
    /*
     * --------------------------------------------------------
     * 1. Validate shipping address ownership
     * --------------------------------------------------------
     */
    const address = await this.prisma.customerAddress.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found.');
    }

    if (!address.postalCode?.trim()) {
      throw new BadRequestException(
        'Shipping address must have a valid postal code.',
      );
    }

    /*
     * --------------------------------------------------------
     * 2. Load customer cart
     * --------------------------------------------------------
     */
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          where: {
            isSelected: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                weightGram: true,
                lengthCm: true,
                widthCm: true,
                heightCm: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
                media: {
                  orderBy: {
                    sortOrder: 'asc',
                  },
                  take: 1,
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException(
        'No selected cart items available for checkout.',
      );
    }

    /*
     * --------------------------------------------------------
     * 3. Calculate item pricing
     * --------------------------------------------------------
     *
     * pricing.finalPrice already represents the price after
     * applicable pricing rules.
     *
     * originalSubtotal
     *   = original price × quantity
     *
     * discountAmount
     *   = (original price - final price) × quantity
     *
     * subtotalAmount
     *   = final price × quantity
     * --------------------------------------------------------
     */
    const items = await Promise.all(
      cart.items.map(async (item) => {
        if (item.quantity <= 0) {
          throw new BadRequestException(
            `Invalid quantity for product ${item.product.name}.`,
          );
        }

        const pricing = await this.pricingService.getProductPrice(
          userId,
          item.productId,
        );

        const originalSubtotal =
          pricing.originalPrice * item.quantity;

        const discountAmount =
          (pricing.originalPrice - pricing.finalPrice) * item.quantity;

        const subtotal = pricing.finalPrice * item.quantity;

        return {
          cartItemId: item.id,
          product: {
            id: item.product.id,
            sku: item.product.sku,
            name: item.product.name,
            brand: item.product.brand.name,
            imageUrl: item.product.media[0]?.url ?? null,
          },
          quantity: item.quantity,
          pricing: {
            originalPrice: pricing.originalPrice,
            finalPrice: pricing.finalPrice,
            discountPercentage: pricing.discountPercentage,
            isMemberDiscountApplicable:
              pricing.isMemberDiscountApplicable,
          },
          originalSubtotal,
          discountAmount,
          subtotal,
        };
      }),
    );

    const originalSubtotalAmount = items.reduce(
      (total, item) => total + item.originalSubtotal,
      0,
    );

    const discountAmount = items.reduce(
      (total, item) => total + item.discountAmount,
      0,
    );

    const subtotalAmount = items.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    /*
     * --------------------------------------------------------
     * 4. Calculate shipping
     * --------------------------------------------------------
     */
    const shipping = await this.shippingService.calculateShipping(
      userId,
      addressId,
    );

    return {
      items: items.map((item) => ({
        cartItemId: item.cartItemId,
        product: item.product,
        quantity: item.quantity,
        pricing: item.pricing,
        subtotal: item.subtotal,
      })),

      shippingAddress: {
        id: address.id,
        label: address.label,
        recipientName: address.recipientName,
        phone: address.phone,
        addressLine: address.addressLine,
        district: address.district,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
      },

      summary: {
        originalSubtotalAmount,
        subtotalAmount,
        discountAmount,
        shippingAmount: 0,
        totalAmount: subtotalAmount,
      },

      shippingOptions: shipping.options,
    };
  }

  async placeOrder(
    userId: string,
    dto: PlaceOrderDto,
    idempotencyKey?: string,
  ) {
    /*
     * --------------------------------------------------------
     * 1. Validate idempotency key
     * --------------------------------------------------------
     */
    if (!idempotencyKey?.trim()) {
      throw new BadRequestException(
        'Idempotency-Key header is required.',
      );
    }

    const normalizedKey = idempotencyKey.trim();
    const requestHash = this.createRequestHash(userId, dto);

    /*
     * --------------------------------------------------------
     * 2. Validate shipping address ownership
     * --------------------------------------------------------
     */
    const address = await this.prisma.customerAddress.findFirst({
      where: {
        id: dto.addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found.');
    }

    if (!address.postalCode?.trim()) {
      throw new BadRequestException(
        'Shipping address must have a valid postal code.',
      );
    }

    /*
     * --------------------------------------------------------
     * 3. Load customer cart
     * --------------------------------------------------------
     */
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      throw new BadRequestException('Shopping cart is empty.');
    }

    /*
     * --------------------------------------------------------
     * 4. Load selected cart items
     * --------------------------------------------------------
     */
    const selectedItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
        isSelected: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        product: {
          select: {
            id: true,
            sku: true,
            name: true,
            price: true,
            weightGram: true,
            lengthCm: true,
            widthCm: true,
            heightCm: true,
          },
        },
      },
    });

    if (selectedItems.length === 0) {
      throw new BadRequestException(
        'No selected cart items available for checkout.',
      );
    }

    /*
     * --------------------------------------------------------
     * 5. Validate selected items
     * --------------------------------------------------------
     */
    for (const item of selectedItems) {
      if (item.quantity <= 0) {
        throw new BadRequestException(
          `Invalid quantity for product ${item.product.name}.`,
        );
      }

      if (
        item.product.weightGram === null ||
        item.product.lengthCm === null ||
        item.product.widthCm === null ||
        item.product.heightCm === null ||
        item.product.weightGram <= 0 ||
        item.product.lengthCm <= 0 ||
        item.product.widthCm <= 0 ||
        item.product.heightCm <= 0
      ) {
        throw new BadRequestException(
          `Product ${item.product.name} has incomplete shipping information.`,
        );
      }
    }

    /*
     * --------------------------------------------------------
     * 6. Recalculate pricing
     * --------------------------------------------------------
     *
     * Important:
     *
     * originalSubtotalAmount
     *   = original price × quantity
     *
     * discountAmount
     *   = (original price - final price) × quantity
     *
     * subtotalAmount
     *   = final price × quantity
     *
     * totalAmount
     *   = subtotalAmount + shipping
     *
     * This avoids deducting the discount twice.
     * --------------------------------------------------------
     */
    const pricedItems = await Promise.all(
      selectedItems.map(async (item) => {
        const pricing = await this.pricingService.getProductPrice(
          userId,
          item.productId,
        );

        const originalSubtotal =
          pricing.originalPrice * item.quantity;

        const discountAmount =
          (pricing.originalPrice - pricing.finalPrice) *
          item.quantity;

        const subtotal =
          pricing.finalPrice * item.quantity;

        return {
          ...item,
          pricing,
          originalSubtotal,
          discountAmount,
          subtotal,
        };
      }),
    );

    const originalSubtotalAmount = pricedItems.reduce(
      (total, item) => total + item.originalSubtotal,
      0,
    );

    const discountAmount = pricedItems.reduce(
      (total, item) => total + item.discountAmount,
      0,
    );

    const subtotalAmount = pricedItems.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    /*
     * --------------------------------------------------------
     * 7. Recalculate shipping
     * --------------------------------------------------------
     *
     * Shipping must always be revalidated at Place Order.
     * --------------------------------------------------------
     */
    const shipping = await this.shippingService.calculateShipping(
      userId,
      dto.addressId,
    );

    const selectedShipping = shipping.options.find(
      (option) =>
        option.courierCode === dto.courierCode &&
        option.serviceCode === dto.serviceCode,
    );

    if (!selectedShipping) {
      throw new BadRequestException(
        'Selected shipping courier or service is no longer available.',
      );
    }

    const shippingAmount = selectedShipping.price;

    /*
     * --------------------------------------------------------
     * 8. Final total
     * --------------------------------------------------------
     */
    const totalAmount = subtotalAmount + shippingAmount;

    /*
     * --------------------------------------------------------
     * 9. Payment expiration
     * --------------------------------------------------------
     *
     * Automated:
     *   QRIS / VA = 30 minutes
     *
     * Manual:
     *   Bank Transfer = 1 hour
     * --------------------------------------------------------
     */
    const paymentWindowMinutes =
      dto.paymentMethod === 'MANUAL_BANK_TRANSFER'
        ? 60
        : 30;

    const expiresAt = new Date(
      Date.now() + paymentWindowMinutes * 60 * 1000,
    );

    const orderNumber = this.generateOrderNumber();

    /*
     * --------------------------------------------------------
     * 10. Atomic checkout transaction
     * --------------------------------------------------------
     */
    const result = await this.prisma.$transaction(
      async (tx) => {
        /*
         * ----------------------------------------------------
         * 10.1 Create idempotency record
         * ----------------------------------------------------
         */
        await tx.idempotencyRecord.createMany({
          data: {
            userId,
            key: normalizedKey,
            operation: 'PLACE_ORDER',
            requestHash,
            status: 'PROCESSING',
            expiresAt,
          },
          skipDuplicates: true,
        });

        const idempotencyRecord =
          await tx.idempotencyRecord.findUnique({
            where: {
              userId_key: {
                userId,
                key: normalizedKey,
              },
            },
          });

        if (!idempotencyRecord) {
          throw new ConflictException(
            'Unable to initialize checkout idempotency.',
          );
        }

        /*
         * Same key + different request
         */
        if (idempotencyRecord.requestHash !== requestHash) {
          throw new ConflictException(
            'Idempotency-Key has already been used with a different request.',
          );
        }

        /*
         * Same key + already completed
         */
        if (idempotencyRecord.status === 'COMPLETED') {
          return idempotencyRecord.responsePayload;
        }

        /*
         * A PROCESSING record can normally only exist while
         * another request is currently handling the same key.
         *
         * We intentionally do not reclaim stale records here.
         * Recovery belongs to a separate mechanism.
         */

        /*
         * ----------------------------------------------------
         * 10.2 Load inventory and reserve stock
         * ----------------------------------------------------
         */
        const inventoryMap = new Map<string, string>();

        for (const item of pricedItems) {
          const inventory =
            await tx.inventory.findUnique({
              where: {
                productId: item.productId,
              },
              select: {
                id: true,
              },
            });

          if (!inventory) {
            throw new BadRequestException(
              `Inventory is not configured for product ${item.product.name}.`,
            );
          }

          /*
           * Atomic stock check + decrement.
           */
          const updatedInventory =
            await tx.inventory.updateMany({
              where: {
                productId: item.productId,
                availableQuantity: {
                  gte: item.quantity,
                },
              },
              data: {
                availableQuantity: {
                  decrement: item.quantity,
                },
                reservedQuantity: {
                  increment: item.quantity,
                },
              },
            });

          if (updatedInventory.count !== 1) {
            throw new BadRequestException(
              `Insufficient stock for product ${item.product.name}.`,
            );
          }

          inventoryMap.set(
            item.productId,
            inventory.id,
          );
        }

        /*
         * ----------------------------------------------------
         * 10.3 Create order
         * ----------------------------------------------------
         */
        const order = await tx.order.create({
          data: {
            userId,
            orderNumber,
            status: 'PENDING_PAYMENT',

            subtotalAmount,
            discountAmount,
            shippingAmount,
            totalAmount,

            shippingProvider: 'biteship',
            shippingCourierCode:
              selectedShipping.courierCode,
            shippingCourierName:
              selectedShipping.courierName,
            shippingServiceCode:
              selectedShipping.serviceCode,
            shippingServiceName:
              selectedShipping.serviceName,

            shippingRecipientName:
              address.recipientName,
            shippingPhone:
              address.phone,
            shippingAddressLine:
              address.addressLine,
            shippingDistrict:
              address.district,
            shippingCity:
              address.city,
            shippingProvince:
              address.province,
            shippingPostalCode:
              address.postalCode,
          },
        });

        /*
         * ----------------------------------------------------
         * 10.4 Create order item snapshots
         * ----------------------------------------------------
         */
        await tx.orderItem.createMany({
          data: pricedItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            productName: item.product.name,
            sku: item.product.sku,
            unitPrice: item.pricing.finalPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        });

        /*
         * ----------------------------------------------------
         * 10.5 Create initial order status history
         * ----------------------------------------------------
         */
        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            fromStatus: null,
            toStatus: 'PENDING_PAYMENT',
            changedByUserId: userId,
            reason:
              'Order created through checkout.',
          },
        });

        /*
         * ----------------------------------------------------
         * 10.6 Create stock reservations
         * ----------------------------------------------------
         */
        await tx.stockReservation.createMany({
          data: pricedItems.map((item) => ({
            productId: item.productId,
            orderId: order.id,
            quantity: item.quantity,
            status: 'RESERVED',
            expiresAt,
          })),
        });

        /*
         * ----------------------------------------------------
         * 10.7 Create stock movement audit records
         * ----------------------------------------------------
         */
        await tx.stockMovement.createMany({
          data: pricedItems.map((item) => ({
            inventoryId:
              inventoryMap.get(item.productId)!,
            type: 'RESERVATION',
            quantity: item.quantity,
            referenceType: 'ORDER',
            referenceId: order.id,
            reason:
              'Stock reserved during checkout.',
            createdByUserId: userId,
          })),
        });

        /*
         * ----------------------------------------------------
         * 10.8 Create payment
         * ----------------------------------------------------
         *
         * Automated:
         *   QRIS / VA -> MIDTRANS
         *
         * Manual:
         *   MANUAL_BANK_TRANSFER -> null
         *
         * PaymentAttempt is NOT created here.
         * It will be created when the automated provider
         * initiation actually happens.
         * ----------------------------------------------------
         */
        const isManualBankTransfer =
          dto.paymentMethod === 'MANUAL_BANK_TRANSFER';

        const payment =
          await tx.payment.create({
            data: {
              orderId: order.id,
              method: dto.paymentMethod,
              status: 'PENDING',
              amount: totalAmount,
              provider: isManualBankTransfer
                ? null
                : 'MIDTRANS',
              expiresAt,
            },
          });

        /*
         * ----------------------------------------------------
         * 10.9 Build transaction response
         * ----------------------------------------------------
         */
        const response = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: order.status,

          summary: {
            originalSubtotalAmount,
            subtotalAmount,
            discountAmount,
            shippingAmount,
            totalAmount,
          },

          shipping: {
            courierCode:
              selectedShipping.courierCode,
            courierName:
              selectedShipping.courierName,
            serviceCode:
              selectedShipping.serviceCode,
            serviceName:
              selectedShipping.serviceName,
            price:
              selectedShipping.price,
            estimatedDelivery:
              selectedShipping.estimatedDelivery,
          },

          payment: {
            id: payment.id,
            method: payment.method,
            status: payment.status,
            amount: payment.amount,
            provider: payment.provider,
            expiresAt:
              payment.expiresAt.toISOString(),
          },
        };

        /*
         * ----------------------------------------------------
         * 10.10 Complete idempotency record
         * ----------------------------------------------------
         */
        await tx.idempotencyRecord.update({
          where: {
            id: idempotencyRecord.id,
          },
          data: {
            status: 'COMPLETED',
            orderId: order.id,
            responsePayload: response,
          },
        });

        return response;
      },
    );

    return result;
  }

  private createRequestHash(
    userId: string,
    dto: PlaceOrderDto,
  ): string {
    return createHash('sha256')
      .update(
        JSON.stringify({
          userId,
          addressId: dto.addressId,
          courierCode: dto.courierCode,
          serviceCode: dto.serviceCode,
          paymentMethod: dto.paymentMethod,
        }),
      )
      .digest('hex');
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now()
      .toString(36)
      .toUpperCase();

    const random = randomBytes(3)
      .toString('hex')
      .toUpperCase();

    return `RUMA-${timestamp}-${random}`;
  }
}