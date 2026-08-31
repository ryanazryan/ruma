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