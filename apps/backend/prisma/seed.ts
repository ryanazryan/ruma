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

  const cleoOxygen = await prisma.brand.upsert({
    where: {
      slug: 'cleo-oxygen',
    },
    update: {},
    create: {
      name: 'Cleo Oxygen',
      slug: 'cleo-oxygen',
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

  const tasPurun = await prisma.brand.upsert({
    where: {
      slug: 'tas-purun',
    },
    update: {},
    create: {
      name: 'Tas Purun',
      slug: 'tas-purun',
    },
  });

  const tupperware = await prisma.brand.upsert({
    where: {
      slug: 'tupperware',
    },
    update: {},
    create: {
      name: 'Tupperware',
      slug: 'tupperware',
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

  const living = await prisma.category.upsert({
    where: {
      slug: 'living',
    },
    update: {},
    create: {
      name: 'Living',
      slug: 'living',
    },
  });

  const outdoor = await prisma.category.upsert({
    where: {
      slug: 'outdoor',
    },
    update: {},
    create: {
      name: 'Outdoor',
      slug: 'outdoor',
    },
  });

  const wellness = await prisma.category.upsert({
    where: {
      slug: 'wellness',
    },
    update: {},
    create: {
      name: 'Wellness',
      slug: 'wellness',
    },
  });

  // --------------------------------------------------
  // Moorlife Products
  // --------------------------------------------------

  const moorlifeProducts = [
    {
      sku: 'ML-MOZAKO',
      name: 'Mozako',
      slug: 'mozako',
      description:
        'Set penyimpanan yang terdiri dari Small Moza Square 600 ml, Medium Moza Square 1 L, Large Moza Square 1.7 L, dan Long Moza Square 2.2 L. Cocok untuk menyimpan berbagai jenis makanan dan camilan.',
      price: 350000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: storage.id,
    },
    {
      sku: 'ML-PIZZARIA',
      name: 'Pizzaria',
      slug: 'pizzaria',
      description:
        'Set yang terdiri dari Pizzaria 2.6 L dan 6 Cup Pizzaria 280 ml. Cocok untuk menyimpan, membawa, dan menyajikan makanan.',
      price: 290000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
    {
      sku: 'ML-NEVERA',
      name: 'Nevera',
      slug: 'nevera',
      description:
        'Set penyimpanan kulkas yang terdiri dari Small Fridge Compartment 1.5 L, Medium Fridge Compartment 2.1 L, dan Large Fridge Compartment 2.6 L. Dilengkapi handle dan sliding seal serta desain transparan.',
      price: 510000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: storage.id,
    },
    {
      sku: 'ML-SERENA',
      name: 'Serena',
      slug: 'serena',
      description:
        'Set freezer storage yang terdiri dari Small Freezer Mate 360 ml, Medium Freezer Mate 830 ml, dan Large Freezer Mate 3 L. Dilengkapi time dial sebagai penanda waktu penyimpanan.',
      price: 400000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: storage.id,
    },
    {
      sku: 'ML-FAMILIA',
      name: 'Familia',
      slug: 'familia',
      description:
        'Family Water Jug berkapasitas 2 L dengan desain yang memudahkan saat menuangkan air dan cocok digunakan untuk kebutuhan minum sehari-hari.',
      price: 210000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
    {
      sku: 'ML-FESTA',
      name: 'Festa',
      slug: 'festa',
      description:
        'Set Mozaic Glass terdiri dari 4 gelas dengan kapasitas masing-masing 370 ml. Cocok untuk menyajikan minuman dengan tampilan yang elegan.',
      price: 240000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
    {
      sku: 'ML-FRUTTA-GLASS',
      name: 'Frutta Glass',
      slug: 'frutta-glass',
      description:
        'Set One Push Fruit Glass terdiri dari 6 gelas berkapasitas masing-masing 270 ml. Dilengkapi one push seal dan desain stackable untuk menghemat ruang.',
      price: 285000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
    {
      sku: 'ML-FRUTTA-BOWL',
      name: 'Frutta Bowl',
      slug: 'frutta-bowl',
      description:
        'Large Fruit Bowl berkapasitas 3.2 L dengan Cooler Disc dan ladle. Cooler Disc dapat disimpan di freezer sebelum digunakan untuk membantu menjaga kesegaran lebih lama.',
      price: 350000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
    {
      sku: 'ML-MAXMILIA',
      name: 'Maxmilia',
      slug: 'maxmilia',
      description:
        'X-Large Family Water Jug dengan kapasitas 4 L. Memiliki handle yang kokoh dan nyaman serta desain yang memudahkan saat menuangkan minuman.',
      price: 345000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: kitchen.id,
    },
    {
      sku: 'ML-SMALL-CANDY-SET',
      name: 'Small Candy Set',
      slug: 'small-candy-set',
      description:
        'Set terdiri dari 4 Small Candy Square dengan kapasitas masing-masing 520 ml. Cocok untuk menyimpan camilan dengan rapi dan praktis.',
      price: 175000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: storage.id,
    },
    {
      sku: 'ML-SLEEK-BITE',
      name: 'Sleek Bite',
      slug: 'sleek-bite',
      description:
        'Set terdiri dari 2 Piko Sleek Bite masing-masing 500 ml dan 1 Orta Sleek Bite 1.1 L. Desain ringkas dengan tutup ulir dan mudah digenggam. Tidak digunakan untuk suhu panas dengan batas maksimum 70°C.',
      price: 240000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: storage.id,
    },
    {
      sku: 'ML-SNACKLA',
      name: 'Snackla',
      slug: 'snackla',
      description:
        'Set Snack Canister terdiri dari 4 wadah dengan kapasitas masing-masing 680 ml. Cocok untuk menyimpan camilan secara rapi dan praktis.',
      price: 240000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: storage.id,
    },
    {
      sku: 'ML-NUVENTURA',
      name: 'Nuventura',
      slug: 'nuventura',
      description:
        'Set meal bowl yang terdiri dari Pranzo Meal Bowl 1.3 L, Nuventura Bag, dan Cutleria. Dilengkapi solusi praktis untuk kebutuhan makanan saat bepergian.',
      price: 330000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: outdoor.id,
    },
    {
      sku: 'ML-PRANDIO',
      name: 'Prandio',
      slug: 'prandio',
      description:
        'Set terdiri dari Prandio Meal Bowl 1.2 L, Prandio Bag, dan Cutleria. Dilengkapi tas bekal yang praktis untuk mendukung mobilitas sehari-hari.',
      price: 320000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: outdoor.id,
    },
    {
      sku: 'ML-LIVO-TUMBLER',
      name: 'Livo Tumbler',
      slug: 'livo-tumbler',
      description:
        'Thermal Tumbler dengan kapasitas 450 ml dan desain yang nyaman untuk menemani aktivitas minum sehari-hari.',
      price: 215000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: wellness.id,
    },
    {
      sku: 'ML-QIANA',
      name: 'Qiana',
      slug: 'qiana',
      description:
        'Set lunch container yang terdiri dari Qiana 1.1 L, Adjustable Compartment, dan Cutleria. Kompartemen dapat disesuaikan untuk membantu membawa beberapa jenis makanan.',
      price: 115000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: outdoor.id,
    },
    {
      sku: 'ML-SPORTIVO-SMALL',
      name: 'Sportivo Bottle Small',
      slug: 'sportivo-bottle-small',
      description:
        'Small Sport Bottle dengan kapasitas 500 ml, diameter 7.5 cm, dan tinggi 23.5 cm. Cocok digunakan untuk aktivitas sehari-hari.',
      price: 100000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: wellness.id,
    },
    {
      sku: 'ML-LUNA',
      name: 'Luna',
      slug: 'luna',
      description:
        'Set Luna terdiri dari Luna Square 800 ml dan Cutleria. Bentuk ringkas dan praktis untuk kebutuhan bekal sehari-hari.',
      price: 90000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: outdoor.id,
    },
    {
      sku: 'ML-SPORTIVO-LARGE',
      name: 'Sportivo Bottle',
      slug: 'sportivo-bottle',
      description:
        'Large Sport Bottle dengan kapasitas 750 ml, diameter 7.5 cm, dan tinggi 26 cm. Cocok untuk aktivitas harian dan mobilitas.',
      price: 115000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: wellness.id,
    },
    {
      sku: 'ML-TOBA',
      name: 'Toba',
      slug: 'toba',
      description:
        'X-Large Sport Bottle dengan kapasitas 2 L, diameter 11.5 cm, dan tinggi 28.5 cm. Memiliki desain modern dan ergonomis serta dilengkapi tutup flip.',
      price: 225000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: wellness.id,
    },
    {
      sku: 'ML-CRYSTAL-HYDRO-1L',
      name: 'Crystal Hydro 1 L',
      slug: 'crystal-hydro-1l',
      description:
        'Set Large Crystal Hydro terdiri dari 2 botol dengan kapasitas masing-masing 1 L. Diameter 8.8 cm dan tinggi 25 cm. Cocok sebagai teman hidrasi sehari-hari.',
      price: 410000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: wellness.id,
    },
    {
      sku: 'ML-CRYSTAL-HYDRO-500',
      name: 'Crystal Hydro 500 ml',
      slug: 'crystal-hydro-500ml',
      description:
        'Set Small Crystal Hydro terdiri dari 2 botol dengan kapasitas masing-masing 500 ml. Diameter 6.9 cm dan tinggi 21 cm.',
      price: 310000,
      brandId: moorlife.id,
      supplierId: supplier.id,
      categoryId: wellness.id,
    },
  ];

  console.log(
    `Moorlife product seed completed: ${moorlifeProducts.length} products.`,
  );

  // --------------------------------------------------
  // Product Catalog Dates
  // --------------------------------------------------
  // These dates represent when products were added to the
  // Ruma catalog for development/testing purposes.
  // They are NOT official Moorlife launch dates.

  const moorlifeProductCreatedAt: Record<string, Date> = {
    mozako: new Date('2026-08-05'),
    pizzaria: new Date('2026-08-10'),
    nevera: new Date('2026-07-20'),
    serena: new Date('2026-08-28'),
    familia: new Date('2026-07-15'),
    festa: new Date('2026-08-12'),
    'frutta-glass': new Date('2026-07-10'),
    'frutta-bowl': new Date('2026-08-25'),
    maxmilia: new Date('2026-07-05'),
    'small-candy-set': new Date('2026-08-18'),
    'sleek-bite': new Date('2026-08-22'),
    snackla: new Date('2026-07-25'),
    nuventura: new Date('2026-09-01'),
    prandio: new Date('2026-08-30'),
    'livo-tumbler': new Date('2026-08-15'),
    qiana: new Date('2026-09-02'),
    'sportivo-bottle-small': new Date('2026-07-18'),
    luna: new Date('2026-08-08'),
    'sportivo-bottle': new Date('2026-08-20'),
    toba: new Date('2026-09-03'),
    'crystal-hydro-1l': new Date('2026-08-27'),
    'crystal-hydro-500ml': new Date('2026-08-29'),
  };

  // --------------------------------------------------
  // Seed Products
  // --------------------------------------------------

  for (const product of moorlifeProducts) {
    const createdAt = moorlifeProductCreatedAt[product.slug];

    if (!createdAt) {
      throw new Error(
        `Missing createdAt configuration for product: ${product.slug}`,
      );
    }

    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        brandId: product.brandId,
        supplierId: product.supplierId,
        categoryId: product.categoryId,
        createdAt,
      },
      create: {
        ...product,
        createdAt,
      },
    });
  }

  // --------------------------------------------------
  // Cleo Oxygen Products
  // --------------------------------------------------

  const cleoOxygenProduct = await prisma.product.upsert({
    where: {
      slug: 'cleo-oxygen-500ml',
    },
    update: {
      sku: 'CO-OXYGEN-500ML',
      name: 'Cleo Oxygen 500 ml',
      description:
        'Cleo Oxygenated Water in a 500 ml bottle.',
      price: 13000,
      brandId: cleoOxygen.id,
      supplierId: supplier.id,
      categoryId: wellness.id,
    },
    create: {
      sku: 'CO-OXYGEN-500ML',
      name: 'Cleo Oxygen 500 ml',
      slug: 'cleo-oxygen-500ml',
      description:
        'Cleo Oxygenated Water in a 500 ml bottle.',
      price: 13000,
      brandId: cleoOxygen.id,
      supplierId: supplier.id,
      categoryId: wellness.id,
    },
  });

  console.log(
    `Cleo Oxygen product seed completed: ${cleoOxygenProduct.name}.`,
  );

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

  const membershipPasswordHash =
  '$argon2id$v=19$m=65536,p=4,t=3$oaaVDd2AkfW/DAjMiUIHTw$kctrkL9Oj5kpHv9Mz5PgnY/ltMEjta0t30rzOXxe+D8';

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
  // Membership Test User
  // --------------------------------------------------

  const membershipCustomer = await prisma.user.upsert({
    where: {
      email: 'membership@ruma.test',
    },
    update: {
      fullName: 'Membership Customer',
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
      membershipStatus: 'NON_MEMBER',
      membershipActivatedAt: null,
      passwordHash: membershipPasswordHash
    },
    create: {
      fullName: 'Membership Customer',
      email: 'membership@ruma.test',
      passwordHash: customerBPasswordHash,
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
      membershipStatus: 'NON_MEMBER',
      membershipActivatedAt: null,
    },
  });

  // --------------------------------------------------
  // Notification Test Fixtures
  // --------------------------------------------------

  await prisma.notification.deleteMany({
    where: {
      userId: {
        in: [orderCustomerA.id, orderCustomerB.id],
      },
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: orderCustomerA.id,
        type: 'ACCOUNT',
        title: 'Welcome to Ruma',
        message: 'Your Ruma account is ready to use.',
        isRead: false,
      },
      {
        userId: orderCustomerA.id,
        type: 'ORDER',
        title: 'Order Delivered',
        message:
          'Your order RUMA-ORDER-002 has been delivered.',
        isRead: true,
      },
      {
        userId: orderCustomerB.id,
        type: 'PAYMENT',
        title: 'Payment Successful',
        message:
          'Payment for order RUMA-ORDER-003 was successful.',
        isRead: false,
      },
    ],
  });

  console.log(
    'Notification test fixture seed completed.',
  );

  // --------------------------------------------------
  // Product References
  // --------------------------------------------------

  const pizzariaProduct =
    await prisma.product.findUniqueOrThrow({
      where: {
        slug: 'pizzaria',
      },
    });

  const mozakoProduct =
    await prisma.product.findUniqueOrThrow({
      where: {
        slug: 'mozako',
      },
    });

  // --------------------------------------------------
  // Membership Test Fixture
  // --------------------------------------------------

  const membershipOrder =
    await prisma.order.upsert({
      where: {
        orderNumber: 'RUMA-MEMBERSHIP-001',
      },
      update: {
        userId: membershipCustomer.id,
        status: 'COMPLETED',
        totalAmount: 610000,
        shippingRecipientName: 'Membership Customer',
        shippingPhone: '081234567890',
        shippingAddressLine:
          'Jl. Membership No. 1',
        shippingDistrict: 'Banjarbaru Utara',
        shippingCity: 'Banjarbaru',
        shippingProvince: 'Kalimantan Selatan',
        shippingPostalCode: '70714',
      },
      create: {
        userId: membershipCustomer.id,
        orderNumber: 'RUMA-MEMBERSHIP-001',
        status: 'COMPLETED',
        totalAmount: 610000,
        shippingRecipientName: 'Membership Customer',
        shippingPhone: '081234567890',
        shippingAddressLine:
          'Jl. Membership No. 1',
        shippingDistrict: 'Banjarbaru Utara',
        shippingCity: 'Banjarbaru',
        shippingProvince: 'Kalimantan Selatan',
        shippingPostalCode: '70714',
      },
    });

  await prisma.orderItem.deleteMany({
    where: {
      orderId: membershipOrder.id,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: membershipOrder.id,
        productId: mozakoProduct.id,
        productName: mozakoProduct.name,
        unitPrice: 350000,
        quantity: 1,
        subtotal: 350000,
      },
      {
        orderId: membershipOrder.id,
        productId: cleoOxygenProduct.id,
        productName: cleoOxygenProduct.name,
        unitPrice: 13000,
        quantity: 20,
        subtotal: 260000,
      },
    ],
  });

  console.log(
    'Membership test fixture seed completed.',
  );

  // --------------------------------------------------
  // Order Test Fixtures
  // --------------------------------------------------

  const orderA1 = await prisma.order.upsert({
    where: {
      orderNumber: 'RUMA-ORDER-001',
    },
    update: {
      status: 'PROCESSING',
      totalAmount: 650000,
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
      totalAmount: 650000,
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
        productId: pizzariaProduct.id,
        productName: pizzariaProduct.name,
        unitPrice: 290000,
        quantity: 1,
        subtotal: 290000,
      },
      {
        orderId: orderA1.id,
        productId: mozakoProduct.id,
        productName: mozakoProduct.name,
        unitPrice: 350000,
        quantity: 1,
        subtotal: 350000,
      },
    ],
  });

  const orderA2 = await prisma.order.upsert({
    where: {
      orderNumber: 'RUMA-ORDER-002',
    },
    update: {
      status: 'DELIVERED',
      totalAmount: 290000,
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
      totalAmount: 290000,
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
      productId: pizzariaProduct.id,
      productName: pizzariaProduct.name,
      unitPrice: 290000,
      quantity: 1,
      subtotal: 290000,
    },
  });

  const orderB1 = await prisma.order.upsert({
    where: {
      orderNumber: 'RUMA-ORDER-003',
    },
    update: {
      status: 'PAID',
      totalAmount: 350000,
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
      totalAmount: 350000,
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
      productId: mozakoProduct.id,
      productName: mozakoProduct.name,
      unitPrice: 350000,
      quantity: 1,
      subtotal: 350000,
    },
  });

  console.log(
    'Order test fixture seed completed.',
  );

  // --------------------------------------------------
  // Product Reviews
  // --------------------------------------------------

  const reviewData = [
    {
      productId: pizzariaProduct.id,
      userId: reviewUsers[0].id,
      rating: 5,
      reviewText:
        'Produknya bagus, praktis, dan sesuai dengan deskripsi.',
    },
    {
      productId: pizzariaProduct.id,
      userId: reviewUsers[1].id,
      rating: 4,
      reviewText:
        'Kualitas bagus dan ukuran wadahnya cocok untuk kebutuhan sehari-hari.',
    },
    {
      productId: pizzariaProduct.id,
      userId: reviewUsers[2].id,
      rating: 5,
      reviewText:
        'Sangat puas, terutama karena bisa digunakan untuk menyimpan sekaligus menyajikan makanan.',
    },
    {
      productId: pizzariaProduct.id,
      userId: reviewUsers[3].id,
      rating: 4,
      reviewText:
        'Desainnya praktis dan mudah digunakan.',
    },
  ];

  for (const review of reviewData) {
    const existingReview =
      await prisma.productReview.findFirst({
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