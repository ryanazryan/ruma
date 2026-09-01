import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --------------------------------------------------
  // Brands
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Suppliers
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Categories
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Products
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Review Users
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Admin User
  // --------------------------------------------------

  const adminPasswordHash =
    '$argon2id$v=19$m=65536,p=4,t=3$bm0wY24iysbUpc4iH7yhdw$smep5cE97TEdimKd9LzzdZNMS0BFnlC5+LDn9IZRZw8';
  const customerBPasswordHash =
    '$argon2id$v=19$m=65536,p=4,t=3$FepD2zAP1boL0jrBhHiCBg$qSAU3l1gAofXeAgLraIMSfKt54R674jVIS3w2ByC7Hw';

  await prisma.user.upsert({
    where: {
      email: 'admin@ruma.test',
    },
    update: {
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      passwordHash: adminPasswordHash,
    },
    create: {
      fullName: 'Ruma Admin',
      email: 'admin@ruma.test',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'wishlist-b@ruma.test',
    },
    update: {},
    create: {
      fullName: 'Wishlist Customer B',
      email: 'wishlist-b@ruma.test',
      passwordHash: customerBPasswordHash,
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
    },
  });

  // --------------------------------------------------
  // Order Test Users
  // --------------------------------------------------

  const orderCustomerA = await prisma.user.upsert({
    where: {
      email: 'order-a@ruma.test',
    },
    update: {},
    create: {
      fullName: 'Order Customer A',
      email: 'order-a@ruma.test',
      passwordHash: customerBPasswordHash,
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
    },
  });

  const orderCustomerB = await prisma.user.upsert({
    where: {
      email: 'order-b@ruma.test',
    },
    update: {},
    create: {
      fullName: 'Order Customer B',
      email: 'order-b@ruma.test',
      passwordHash: customerBPasswordHash,
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
    },
  });

  // --------------------------------------------------
  // Product Reviews
  // --------------------------------------------------

  const exampleProduct = await prisma.product.findUniqueOrThrow({
    where: {
      slug: 'moorlife-example-product',
    },
  });

  const storageProduct = await prisma.product.findUniqueOrThrow({
    where: {
      slug: 'moorlife-storage-product',
    },
  });

  // --------------------------------------------------
  // Order Test Fixtures
  // --------------------------------------------------

  const orderA1 = await prisma.order.upsert({
    where: {
      orderNumber: 'RUMA-ORDER-001',
    },
    update: {
      status: 'PROCESSING',
      totalAmount: 325000,
      shippingRecipientName: 'Order Customer A',
      shippingPhone: '081234567890',
      shippingAddressLine: 'Jl. Contoh No. 1',
      shippingDistrict: 'Banjarbaru Utara',
      shippingCity: 'Banjarbaru',
      shippingProvince: 'Kalimantan Selatan',
      shippingPostalCode: '70714',
    },
    create: {
      userId: orderCustomerA.id,
      orderNumber: 'RUMA-ORDER-001',
      status: 'PROCESSING',
      totalAmount: 325000,
      shippingRecipientName: 'Order Customer A',
      shippingPhone: '081234567890',
      shippingAddressLine: 'Jl. Contoh No. 1',
      shippingDistrict: 'Banjarbaru Utara',
      shippingCity: 'Banjarbaru',
      shippingProvince: 'Kalimantan Selatan',
      shippingPostalCode: '70714',
    },
  });

  await prisma.orderItem.deleteMany({
    where: {
      orderId: orderA1.id,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: orderA1.id,
        productId: exampleProduct.id,
        productName: exampleProduct.name,
        unitPrice: 125000,
        quantity: 2,
        subtotal: 250000,
      },
      {
        orderId: orderA1.id,
        productId: storageProduct.id,
        productName: storageProduct.name,
        unitPrice: 75000,
        quantity: 1,
        subtotal: 75000,
      },
    ],
  });

  const orderA2 = await prisma.order.upsert({
    where: {
      orderNumber: 'RUMA-ORDER-002',
    },
    update: {
      status: 'DELIVERED',
      totalAmount: 125000,
      shippingRecipientName: 'Order Customer A',
      shippingPhone: '081234567890',
      shippingAddressLine: 'Jl. Contoh No. 1',
      shippingDistrict: 'Banjarbaru Utara',
      shippingCity: 'Banjarbaru',
      shippingProvince: 'Kalimantan Selatan',
      shippingPostalCode: '70714',
    },
    create: {
      userId: orderCustomerA.id,
      orderNumber: 'RUMA-ORDER-002',
      status: 'DELIVERED',
      totalAmount: 125000,
      shippingRecipientName: 'Order Customer A',
      shippingPhone: '081234567890',
      shippingAddressLine: 'Jl. Contoh No. 1',
      shippingDistrict: 'Banjarbaru Utara',
      shippingCity: 'Banjarbaru',
      shippingProvince: 'Kalimantan Selatan',
      shippingPostalCode: '70714',
    },
  });

  await prisma.orderItem.deleteMany({
    where: {
      orderId: orderA2.id,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderA2.id,
      productId: exampleProduct.id,
      productName: exampleProduct.name,
      unitPrice: 125000,
      quantity: 1,
      subtotal: 125000,
    },
  });

  const orderB1 = await prisma.order.upsert({
    where: {
      orderNumber: 'RUMA-ORDER-003',
    },
    update: {
      status: 'PAID',
      totalAmount: 75000,
      shippingRecipientName: 'Order Customer B',
      shippingPhone: '081298765432',
      shippingAddressLine: 'Jl. Contoh No. 2',
      shippingDistrict: 'Banjarbaru Selatan',
      shippingCity: 'Banjarbaru',
      shippingProvince: 'Kalimantan Selatan',
      shippingPostalCode: '70712',
    },
    create: {
      userId: orderCustomerB.id,
      orderNumber: 'RUMA-ORDER-003',
      status: 'PAID',
      totalAmount: 75000,
      shippingRecipientName: 'Order Customer B',
      shippingPhone: '081298765432',
      shippingAddressLine: 'Jl. Contoh No. 2',
      shippingDistrict: 'Banjarbaru Selatan',
      shippingCity: 'Banjarbaru',
      shippingProvince: 'Kalimantan Selatan',
      shippingPostalCode: '70712',
    },
  });

  await prisma.orderItem.deleteMany({
    where: {
      orderId: orderB1.id,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderB1.id,
      productId: storageProduct.id,
      productName: storageProduct.name,
      unitPrice: 75000,
      quantity: 1,
      subtotal: 75000,
    },
  });

  console.log('Order test fixture seed completed.');

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
  console.log('Admin user seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
