import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const moorlife = await prisma.brand.upsert({
    where: {
      slug: 'moorlife',
    },
    update: {},
    create: {
      name: 'Moorlife',
      slug: 'moorlife',
    },
  });

  const otherBrand = await prisma.brand.upsert({
    where: {
      slug: 'brand-lain',
    },
    update: {},
    create: {
      name: 'Brand Lain',
      slug: 'brand-lain',
    },
  });

  const supplier = await prisma.supplier.upsert({
    where: {
      slug: 'moorlife-supplier',
    },
    update: {},
    create: {
      name: 'Moorlife Supplier',
      slug: 'moorlife-supplier',
    },
  });

  const kitchen = await prisma.category.upsert({
    where: {
      slug: 'kitchen',
    },
    update: {},
    create: {
      name: 'Kitchen',
      slug: 'kitchen',
    },
  });

  const storage = await prisma.category.upsert({
    where: {
      slug: 'storage',
    },
    update: {},
    create: {
      name: 'Storage',
      slug: 'storage',
    },
  });

  const reviewUsers = await Promise.all([
    prisma.user.upsert({
      where: {
        email: 'review-a@ruma.test',
      },
      update: {},
      create: {
        fullName: 'Review Customer A',
        email: 'review-a@ruma.test',
        passwordHash:
          '$2b$10$7EqJtq98hPqEX7fNZaFWoOeFQf8f0f4lH5Vh3a5cXx0XfF7L7j7yS',
        role: 'CUSTOMER',
        accountStatus: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: {
        email: 'review-b@ruma.test',
      },
      update: {},
      create: {
        fullName: 'Review Customer B',
        email: 'review-b@ruma.test',
        passwordHash:
          '$2b$10$7EqJtq98hPqEX7fNZaFWoOeFQf8f0f4lH5Vh3a5cXx0XfF7L7j7yS',
        role: 'CUSTOMER',
        accountStatus: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: {
        email: 'review-c@ruma.test',
      },
      update: {},
      create: {
        fullName: 'Review Customer C',
        email: 'review-c@ruma.test',
        passwordHash:
          '$2b$10$7EqJtq98hPqEX7fNZaFWoOeFQf8f0f4lH5Vh3a5cXx0XfF7L7j7yS',
        role: 'CUSTOMER',
        accountStatus: 'ACTIVE',
      },
    }),
    prisma.user.upsert({
      where: {
        email: 'review-d@ruma.test',
      },
      update: {},
      create: {
        fullName: 'Review Customer D',
        email: 'review-d@ruma.test',
        passwordHash:
          '$2b$10$7EqJtq98hPqEX7fNZaFWoOeFQf8f0f4lH5Vh3a5cXx0XfF7L7j7yS',
        role: 'CUSTOMER',
        accountStatus: 'ACTIVE',
      },
    }),
  ]);

  const exampleProduct = await prisma.product.findUniqueOrThrow({
    where: {
      slug: 'moorlife-example-product',
    },
  });

    const reviewData = [
    {
      productId: exampleProduct.id,
      userId: reviewUsers[0].id,
      rating: 5,
      reviewText: 'Produknya bagus dan sesuai deskripsi.',
    },
    {
      productId: exampleProduct.id,
      userId: reviewUsers[1].id,
      rating: 4,
      reviewText: 'Kualitas bagus, pengiriman juga aman.',
    },
    {
      productId: exampleProduct.id,
      userId: reviewUsers[2].id,
      rating: 5,
      reviewText: 'Sangat puas dengan produknya.',
    },
    {
      productId: exampleProduct.id,
      userId: reviewUsers[3].id,
      rating: 3,
      reviewText: 'Produknya cukup baik, tetapi masih bisa ditingkatkan.',
    },
  ];

  for (const review of reviewData) {
    const existingReview = await prisma.productReview.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    if (existingReview) {
      await prisma.productReview.update({
        where: {
          id: existingReview.id,
        },
        data: {
          rating: review.rating,
          reviewText: review.reviewText,
        },
      });
    } else {
      await prisma.productReview.create({
        data: review,
      });
    }
  }

  console.log('Product review seed completed.');

  await prisma.product.upsert({
    where: {
      slug: 'moorlife-example-product',
    },
    update: {
      sku: 'ML-001',
      name: 'Moorlife Example Product',
      description: 'Development product for Ruma catalog testing.',
      price: 125000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
    create: {
      sku: 'ML-001',
      name: 'Moorlife Example Product',
      slug: 'moorlife-example-product',
      description: 'Development product for Ruma catalog testing.',
      price: 125000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
  });

  await prisma.product.upsert({
    where: {
      slug: 'moorlife-storage-product',
    },
    update: {
      sku: 'ML-002',
      name: 'Moorlife Storage Product',
      description: 'Development storage product for filter testing.',
      price: 75000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: storage.id,
    },
    create: {
      sku: 'ML-002',
      name: 'Moorlife Storage Product',
      slug: 'moorlife-storage-product',
      description: 'Development storage product for filter testing.',
      price: 75000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: storage.id,
    },
  });

  await prisma.product.upsert({
    where: {
      slug: 'brand-lain-kitchen-product',
    },
    update: {
      sku: 'BL-001',
      name: 'Brand Lain Kitchen Product',
      description: 'Development product for category and brand filter testing.',
      price: 200000,
      brandId: otherBrand.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
    create: {
      sku: 'BL-001',
      name: 'Brand Lain Kitchen Product',
      slug: 'brand-lain-kitchen-product',
      description: 'Development product for category and brand filter testing.',
      price: 200000,
      brandId: otherBrand.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
  });

  console.log('Product seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
