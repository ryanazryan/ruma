import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SubmitManualTransferDto } from './dto/submit-manual-transfer.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getPayment(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            userId: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
        },
        attempts: {
          orderBy: {
            attemptNumber: 'desc',
          },
          select: {
            id: true,
            attemptNumber: true,
            providerReference: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        submissions: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            senderBank: true,
            senderName: true,
            transferAmount: true,
            transferredAt: true,
            proofUrl: true,
            status: true,
            rejectionReason: true,
            verifiedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    if (payment.order.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this payment.',
      );
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor((payment.expiresAt.getTime() - Date.now()) / 1000),
    );

    return {
      id: payment.id,
      order: {
        id: payment.order.id,
        orderNumber: payment.order.orderNumber,
        status: payment.order.status,
        totalAmount: payment.order.totalAmount,
        createdAt: payment.order.createdAt,
      },
      method: payment.method,
      status: payment.status,
      amount: payment.amount,
      provider: payment.provider,
      providerTransactionId: payment.providerTransactionId,
      createdAt: payment.createdAt,
      expiresAt: payment.expiresAt,
      expiredAt: payment.expiredAt,
      paidAt: payment.paidAt,
      remainingSeconds,
      attempts: payment.attempts,
      submissions: payment.submissions,
    };
  }

  async getPaymentStatus(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        order: {
          select: {
            userId: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    if (payment.order.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this payment.',
      );
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor((payment.expiresAt.getTime() - Date.now()) / 1000),
    );

    return {
      paymentId: payment.id,
      status: payment.status,
      method: payment.method,
      provider: payment.provider,
      amount: payment.amount,
      orderStatus: payment.order.status,
      expiresAt: payment.expiresAt,
      remainingSeconds,
    };
  }

  async getManualTransferInstructions(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            userId: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    if (payment.order.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this payment.',
      );
    }

    if (payment.method !== 'MANUAL_BANK_TRANSFER') {
      throw new BadRequestException(
        'Manual transfer instructions are only available for manual bank transfer payments.',
      );
    }

    const bankName = this.configService.get<string>(
      'payment.manualTransfer.bankName',
    );

    const accountNumber = this.configService.get<string>(
      'payment.manualTransfer.accountNumber',
    );

    const accountName = this.configService.get<string>(
      'payment.manualTransfer.accountName',
    );

    if (!bankName || !accountNumber || !accountName) {
      throw new BadRequestException(
        'Manual bank transfer destination is not configured.',
      );
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor((payment.expiresAt.getTime() - Date.now()) / 1000),
    );

    return {
      paymentId: payment.id,
      orderId: payment.order.id,
      orderNumber: payment.order.orderNumber,
      amount: payment.amount,
      currency: 'IDR',
      paymentStatus: payment.status,
      expiresAt: payment.expiresAt,
      remainingSeconds,
      bankAccount: {
        bankName,
        accountNumber,
        accountName,
      },
    };
  }

  async submitManualTransferPayment(
    userId: string,
    paymentId: string,
    dto: SubmitManualTransferDto,
    proofFile: Express.Multer.File,
  ) {
    if (!proofFile) {
      throw new BadRequestException('Transfer proof is required.');
    }

    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(proofFile.mimetype)
    ) {
      throw new BadRequestException(
        'Transfer proof must be a JPEG, PNG, or WebP image.',
      );
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (proofFile.size > maxFileSize) {
      throw new BadRequestException('Transfer proof must not exceed 5 MB.');
    }

    const payment = await this.prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            userId: true,
          },
        },
        submissions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    if (payment.order.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this payment.',
      );
    }

    if (payment.method !== 'MANUAL_BANK_TRANSFER') {
      throw new BadRequestException(
        'Payment is not a manual bank transfer payment.',
      );
    }

    const now = new Date();

    if (now >= payment.expiresAt) {
      throw new BadRequestException('Payment has expired.');
    }

    if (payment.status === 'PAID') {
      throw new BadRequestException('Payment has already been paid.');
    }

    if (payment.status === 'EXPIRED') {
      throw new BadRequestException('Payment has expired.');
    }

    /*
     * A new submission is allowed when:
     *
     * 1. payment is PENDING
     * 2. payment is PROCESSING and the latest submission
     *    was REJECTED
     */
    if (payment.status === 'PROCESSING') {
      const latestSubmission = payment.submissions[0];

      if (!latestSubmission || latestSubmission.status !== 'REJECTED') {
        throw new BadRequestException(
          'Payment already has a submission under review.',
        );
      }
    }

    /*
     * Exact amount validation.
     */
    if (dto.transferAmount !== payment.amount) {
      throw new BadRequestException(
        `Transfer amount must exactly match the payment amount of ${payment.amount}.`,
      );
    }

    const transferredAt = new Date(dto.transferredAt);

    if (Number.isNaN(transferredAt.getTime())) {
      throw new BadRequestException('Invalid transfer date and time.');
    }

    if (transferredAt > now) {
      throw new BadRequestException(
        'Transfer date and time cannot be in the future.',
      );
    }

    /*
     * Upload proof outside the DB transaction.
     *
     * This follows the existing Cloudinary upload pattern
     * used by the customer profile module.
     */
    const uploadedProof = await this.cloudinaryService.uploadImage(
      proofFile.buffer,
      'ruma/payment-proofs',
    );

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        /*
         * Re-check payment state inside the transaction
         * to reduce race-condition risk.
         */
        const currentPayment = await tx.payment.findUnique({
          where: {
            id: paymentId,
          },
          include: {
            submissions: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
              select: {
                id: true,
                status: true,
              },
            },
          },
        });

        if (!currentPayment) {
          throw new NotFoundException('Payment not found.');
        }

        if (currentPayment.method !== 'MANUAL_BANK_TRANSFER') {
          throw new BadRequestException(
            'Payment is not a manual bank transfer payment.',
          );
        }

        if (
          currentPayment.status === 'PAID' ||
          currentPayment.status === 'EXPIRED'
        ) {
          throw new BadRequestException(
            'Payment is no longer available for submission.',
          );
        }

        if (new Date() >= currentPayment.expiresAt) {
          throw new BadRequestException('Payment has expired.');
        }

        if (currentPayment.status === 'PROCESSING') {
          const latestSubmission = currentPayment.submissions[0];

          if (!latestSubmission || latestSubmission.status !== 'REJECTED') {
            throw new BadRequestException(
              'Payment already has a submission under review.',
            );
          }
        }

        if (dto.transferAmount !== currentPayment.amount) {
          throw new BadRequestException(
            `Transfer amount must exactly match the payment amount of ${currentPayment.amount}.`,
          );
        }

        const submission = await tx.paymentSubmission.create({
          data: {
            paymentId: currentPayment.id,
            senderBank: dto.senderBank.trim(),
            senderName: dto.senderName.trim(),
            transferAmount: dto.transferAmount,
            transferredAt,
            proofUrl: uploadedProof.secure_url,
            submittedData: {
              senderBank: dto.senderBank.trim(),
              senderName: dto.senderName.trim(),
              transferAmount: dto.transferAmount,
              transferredAt: transferredAt.toISOString(),
            },
            status: 'PENDING_REVIEW',
          },
        });

        await tx.payment.update({
          where: {
            id: currentPayment.id,
          },
          data: {
            status: 'PROCESSING',
          },
        });

        return submission;
      });

      return {
        id: result.id,
        paymentId: result.paymentId,
        senderBank: result.senderBank,
        senderName: result.senderName,
        transferAmount: result.transferAmount,
        transferredAt: result.transferredAt,
        proofUrl: result.proofUrl,
        status: result.status,
        rejectionReason: result.rejectionReason,
        createdAt: result.createdAt,
      };
    } catch (error) {
      /*
       * The file may already exist in Cloudinary if the DB
       * transaction fails. The current schema does not store
       * Cloudinary publicId, so deletion cannot be performed
       * safely here with the existing model.
       *
       * We therefore rethrow the original business/database
       * error.
       */
      throw error;
    }
  }

  async getPaymentSubmissions(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      select: {
        id: true,
        method: true,
        amount: true,
        status: true,
        expiresAt: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            userId: true,
          },
        },
        submissions: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            paymentId: true,
            senderBank: true,
            senderName: true,
            transferAmount: true,
            transferredAt: true,
            proofUrl: true,
            ocrData: true,
            submittedData: true,
            status: true,
            rejectionReason: true,
            verifiedByUserId: true,
            verifiedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    if (payment.order.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this payment.',
      );
    }

    if (payment.method !== 'MANUAL_BANK_TRANSFER') {
      throw new BadRequestException(
        'Payment submissions are only available for manual bank transfer payments.',
      );
    }

    return {
      paymentId: payment.id,
      orderId: payment.order.id,
      orderNumber: payment.order.orderNumber,
      paymentStatus: payment.status,
      paymentAmount: payment.amount,
      expiresAt: payment.expiresAt,
      submissions: payment.submissions,
    };
  }

  async getPaymentSubmission(userId: string, submissionId: string) {
    const submission = await this.prisma.paymentSubmission.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        payment: {
          select: {
            id: true,
            method: true,
            status: true,
            amount: true,
            expiresAt: true,
            order: {
              select: {
                id: true,
                orderNumber: true,
                userId: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Payment submission not found.');
    }

    if (submission.payment.order.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this payment submission.',
      );
    }

    if (submission.payment.method !== 'MANUAL_BANK_TRANSFER') {
      throw new BadRequestException(
        'Payment submission is only available for manual bank transfer payments.',
      );
    }

    return {
      id: submission.id,
      paymentId: submission.paymentId,

      order: {
        id: submission.payment.order.id,
        orderNumber: submission.payment.order.orderNumber,
        status: submission.payment.order.status,
      },

      payment: {
        method: submission.payment.method,
        status: submission.payment.status,
        amount: submission.payment.amount,
        expiresAt: submission.payment.expiresAt,
      },

      senderBank: submission.senderBank,
      senderName: submission.senderName,
      transferAmount: submission.transferAmount,
      transferredAt: submission.transferredAt,

      proofUrl: submission.proofUrl,

      ocrData: submission.ocrData,
      submittedData: submission.submittedData,

      status: submission.status,
      rejectionReason: submission.rejectionReason,

      verifiedByUserId: submission.verifiedByUserId,

      verifiedAt: submission.verifiedAt,

      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    };
  }

  async rejectManualPaymentSubmission(
    adminUserId: string,
    submissionId: string,
    rejectionReason: string,
  ) {
    const reason = rejectionReason.trim();

    if (!reason) {
      throw new BadRequestException('Rejection reason is required.');
    }

    return this.prisma.$transaction(async (tx) => {
      const submission = await tx.paymentSubmission.findUnique({
        where: {
          id: submissionId,
        },
        include: {
          payment: {
            select: {
              id: true,
              method: true,
              status: true,
              expiresAt: true,
              order: {
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          },
        },
      });

      if (!submission) {
        throw new NotFoundException('Payment submission not found.');
      }

      if (submission.payment.method !== 'MANUAL_BANK_TRANSFER') {
        throw new BadRequestException(
          'Payment submission is only available for manual bank transfer payments.',
        );
      }

      /*
       * Only PENDING_REVIEW can be rejected.
       *
       * This prevents duplicate rejection / approval.
       */
      const claim = await tx.paymentSubmission.updateMany({
        where: {
          id: submissionId,
          status: 'PENDING_REVIEW',
        },
        data: {
          status: 'REJECTED',
          rejectionReason: reason,
          verifiedByUserId: adminUserId,
          verifiedAt: new Date(),
        },
      });

      if (claim.count !== 1) {
        throw new ConflictException(
          'Payment submission has already been processed.',
        );
      }

      /*
       * Re-check payment/order state after claiming
       * the submission.
       *
       * If any validation fails, the transaction rolls back,
       * so the submission remains PENDING_REVIEW.
       */
      const currentPayment = await tx.payment.findUnique({
        where: {
          id: submission.payment.id,
        },
        select: {
          id: true,
          status: true,
          expiresAt: true,
          order: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (!currentPayment) {
        throw new NotFoundException('Payment not found.');
      }

      if (currentPayment.status === 'PAID') {
        throw new ConflictException('Payment has already been paid.');
      }

      if (currentPayment.status === 'EXPIRED') {
        throw new ConflictException('Payment has expired.');
      }

      if (currentPayment.status !== 'PROCESSING') {
        throw new ConflictException(
          'Payment is not currently under manual verification.',
        );
      }

      if (currentPayment.order.status !== 'PENDING_PAYMENT') {
        throw new ConflictException('Order is no longer awaiting payment.');
      }

      if (new Date() >= currentPayment.expiresAt) {
        throw new ConflictException('Payment has expired.');
      }

      const updatedSubmission = await tx.paymentSubmission.findUnique({
        where: {
          id: submissionId,
        },
        select: {
          id: true,
          paymentId: true,
          status: true,
          rejectionReason: true,
          verifiedByUserId: true,
          verifiedAt: true,
        },
      });

      if (!updatedSubmission) {
        throw new NotFoundException('Payment submission not found.');
      }

      return {
        id: updatedSubmission.id,
        paymentId: updatedSubmission.paymentId,
        status: updatedSubmission.status,
        rejectionReason: updatedSubmission.rejectionReason,
        verifiedByUserId: updatedSubmission.verifiedByUserId,
        verifiedAt: updatedSubmission.verifiedAt,
      };
    });
  }

  async approveManualPaymentSubmission(
    adminUserId: string,
    submissionId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const submission = await tx.paymentSubmission.findUnique({
        where: {
          id: submissionId,
        },
        include: {
          payment: {
            select: {
              id: true,
              method: true,
              status: true,
              amount: true,
              expiresAt: true,
              order: {
                select: {
                  id: true,
                  orderNumber: true,
                  status: true,
                },
              },
            },
          },
        },
      });

      if (!submission) {
        throw new NotFoundException('Payment submission not found.');
      }

      if (submission.payment.method !== 'MANUAL_BANK_TRANSFER') {
        throw new BadRequestException(
          'Payment submission is only available for manual bank transfer payments.',
        );
      }

      /*
       * Atomically claim the submission.
       *
       * Only one concurrent request can change
       * PENDING_REVIEW → APPROVED.
       */
      const claim = await tx.paymentSubmission.updateMany({
        where: {
          id: submissionId,
          status: 'PENDING_REVIEW',
        },
        data: {
          status: 'APPROVED',
          verifiedByUserId: adminUserId,
          verifiedAt: new Date(),
          rejectionReason: null,
        },
      });

      if (claim.count !== 1) {
        throw new ConflictException(
          'Payment submission has already been processed.',
        );
      }

      /*
       * Re-fetch current payment state after claiming
       * the submission.
       */
      const currentPayment = await tx.payment.findUnique({
        where: {
          id: submission.payment.id,
        },
        select: {
          id: true,
          status: true,
          amount: true,
          expiresAt: true,
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
            },
          },
        },
      });

      if (!currentPayment) {
        throw new NotFoundException('Payment not found.');
      }

      if (currentPayment.status === 'PAID') {
        throw new ConflictException('Payment has already been paid.');
      }

      if (currentPayment.status === 'EXPIRED') {
        throw new ConflictException('Payment has expired.');
      }

      if (currentPayment.status !== 'PROCESSING') {
        throw new ConflictException(
          'Payment is not currently under manual verification.',
        );
      }

      if (currentPayment.order.status !== 'PENDING_PAYMENT') {
        throw new ConflictException('Order is no longer awaiting payment.');
      }

      const now = new Date();

      if (now >= currentPayment.expiresAt) {
        throw new ConflictException('Payment has expired.');
      }

      /*
       * Exact transfer amount validation.
       */
      if (submission.transferAmount !== currentPayment.amount) {
        throw new BadRequestException(
          'Transfer amount does not match the payment amount.',
        );
      }

      /*
       * ----------------------------------------------------
       * 1. Mark payment as PAID
       * ----------------------------------------------------
       *
       * Conditional update makes the transition atomic.
       */
      const paymentUpdate = await tx.payment.updateMany({
        where: {
          id: currentPayment.id,
          status: 'PROCESSING',
        },
        data: {
          status: 'PAID',
          paidAt: now,
        },
      });

      if (paymentUpdate.count !== 1) {
        throw new ConflictException('Payment has already been processed.');
      }

      /*
       * ----------------------------------------------------
       * 2. Mark order as PAID
       * ----------------------------------------------------
       */
      const orderUpdate = await tx.order.updateMany({
        where: {
          id: currentPayment.order.id,
          status: 'PENDING_PAYMENT',
        },
        data: {
          status: 'PAID',
        },
      });

      if (orderUpdate.count !== 1) {
        throw new ConflictException('Order is no longer awaiting payment.');
      }

      await tx.orderStatusHistory.create({
        data: {
          orderId: currentPayment.order.id,
          fromStatus: 'PENDING_PAYMENT',
          toStatus: 'PAID',
          changedByUserId: adminUserId,
          reason: 'Manual bank transfer payment approved.',
        },
      });

      /*
       * ----------------------------------------------------
       * 3. Find active stock reservations
       * ----------------------------------------------------
       */
      const reservations = await tx.stockReservation.findMany({
        where: {
          orderId: currentPayment.order.id,
          status: 'RESERVED',
        },
        select: {
          id: true,
          productId: true,
          quantity: true,
        },
      });

      if (reservations.length === 0) {
        throw new ConflictException(
          'No active stock reservations found for this order.',
        );
      }

      /*
       * ----------------------------------------------------
       * 4. Commit stock
       * ----------------------------------------------------
       */
      for (const reservation of reservations) {
        const inventory = await tx.inventory.findUnique({
          where: {
            productId: reservation.productId,
          },
          select: {
            id: true,
          },
        });

        if (!inventory) {
          throw new BadRequestException(
            `Inventory is not configured for product ${reservation.productId}.`,
          );
        }

        const inventoryUpdate = await tx.inventory.updateMany({
          where: {
            id: inventory.id,
            reservedQuantity: {
              gte: reservation.quantity,
            },
          },
          data: {
            reservedQuantity: {
              decrement: reservation.quantity,
            },
            committedQuantity: {
              increment: reservation.quantity,
            },
          },
        });

        if (inventoryUpdate.count !== 1) {
          throw new ConflictException(
            `Unable to commit stock for product ${reservation.productId}.`,
          );
        }

        const reservationUpdate = await tx.stockReservation.updateMany({
          where: {
            id: reservation.id,
            status: 'RESERVED',
          },
          data: {
            status: 'COMMITTED',
            committedAt: now,
          },
        });

        if (reservationUpdate.count !== 1) {
          throw new ConflictException(
            `Stock reservation for product ${reservation.productId} has already been processed.`,
          );
        }

        await tx.stockMovement.create({
          data: {
            inventoryId: inventory.id,
            type: 'COMMIT',
            quantity: reservation.quantity,
            referenceType: 'ORDER',
            referenceId: currentPayment.order.id,
            reason: 'Reserved stock committed after manual payment approval.',
            createdByUserId: adminUserId,
          },
        });
      }

      /*
       * ----------------------------------------------------
       * 5. Return final state
       * ----------------------------------------------------
       */
      return {
        submission: {
          id: submission.id,
          status: 'APPROVED',
          verifiedByUserId: adminUserId,
          verifiedAt: now,
        },

        payment: {
          id: currentPayment.id,
          status: 'PAID',
          paidAt: now,
        },

        order: {
          id: currentPayment.order.id,
          orderNumber: currentPayment.order.orderNumber,
          status: 'PAID',
        },
      };
    });
  }

  async getAdminPaymentSubmissions() {
    const submissions = await this.prisma.paymentSubmission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        paymentId: true,
        senderBank: true,
        senderName: true,
        transferAmount: true,
        transferredAt: true,
        proofUrl: true,
        ocrData: true,
        submittedData: true,
        status: true,
        rejectionReason: true,
        verifiedByUserId: true,
        verifiedAt: true,
        createdAt: true,
        updatedAt: true,

        payment: {
          select: {
            id: true,
            method: true,
            status: true,
            amount: true,
            expiresAt: true,
            paidAt: true,

            order: {
              select: {
                id: true,
                orderNumber: true,
                status: true,

                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      submissions,
    };
  }

  async getAdminPaymentSubmission(submissionId: string) {
    const submission = await this.prisma.paymentSubmission.findUnique({
      where: {
        id: submissionId,
      },
      select: {
        id: true,
        paymentId: true,
        senderBank: true,
        senderName: true,
        transferAmount: true,
        transferredAt: true,
        proofUrl: true,
        ocrData: true,
        submittedData: true,
        status: true,
        rejectionReason: true,
        verifiedByUserId: true,
        verifiedAt: true,
        createdAt: true,
        updatedAt: true,

        payment: {
          select: {
            id: true,
            method: true,
            status: true,
            amount: true,
            expiresAt: true,
            expiredAt: true,
            paidAt: true,

            order: {
              select: {
                id: true,
                orderNumber: true,
                status: true,
                userId: true,

                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },

        verifiedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Payment submission not found.');
    }

    return submission;
  }
}
