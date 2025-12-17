import { prisma } from '../src/config/prisma.js';
import { ProductCategory } from '@prisma/client';

import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding database");

  await clearDatabase();

  // Create users
  const admin = await createAdmin();
  const storeUser = await createStoreUser("Misu", "Optics");

  // Create stores
  const store1 = await createStore(storeUser.id, "Misu Optics - Yarmag", "Yarmag");
  const store2 = await createStore(storeUser.id, "Misu Optics - Tara", "Tara");

  // Create products
  const frame1 = await createProduct("Raybans Black Frame", "MIS123456", "Rayban", ProductCategory.FRAME, 20.0, 50.0);
  const frame2 = await createProduct("GentleMonster Frame", "MIS342356", "Gentle Monster", ProductCategory.FRAME, 25.0, 90.0);
  const lens1 = await createProduct("Single Vision Lens", "MIS987654", "Essilor", ProductCategory.LENSE, 15.0, 40.0);
  const lens2 = await createProduct("Progressive Lens", "MIS456789", "Hoya", ProductCategory.LENSE, 30.0, 80.0);
  const accessory1 = await createProduct("Cleaning Cloth", "MIS112233", "OptiClean", ProductCategory.ACCESSORIES, 5.0, 10.0);
  const accessory2 = await createProduct("Eyeglass Case", "MIS445566", "CaseMate", ProductCategory.ACCESSORIES, 8.0, 16.0);
  const contactLens1 = await createProduct("Daily Contact Lenses", "MIS778899", "Acuvue", ProductCategory.CONTACT_LENSES, 5.0, 12.0);
  const randomProduct = await createProduct("Random Product", "MIS000000", "RandomBrand", ProductCategory.OTHERS, 10.0, 20.0);
  
  

  // Create lens specifications
  const singleVisionVariants = await Promise.all([
    createLensSpecification(lens1.id, -1.00, -0.50, 180, null, 4.00, 70.0, "UV & AR Coating", "Plastic", "Single Vision"),
    createLensSpecification(lens1.id, -1.25, -0.75, 180, null, 4.00, 70.0, "UV & AR Coating", "Plastic", "Single Vision"),
    createLensSpecification(lens1.id, -2.00, -1.00, 170, null, 4.25, 72.0, "UV & AR Coating", "Plastic", "Single Vision")
  ]);

  const progressiveVariants = await Promise.all([
    createLensSpecification(lens2.id, +1.50, -0.75, 170, +2.00, 5.00, 72.0, "Blue Light Filter", "High-Index 1.67", "Progressive"),
    createLensSpecification(lens2.id, +2.00, -0.50, 160, +2.25, 5.00, 70.0, "Blue Light Filter", "High-Index 1.67", "Progressive")
  ]);

  // Inventory per store (linking both product and lens variants)
  await Promise.all([
    // Store 1 — mix of frames and lenses
    createStoreInventory(store1.id, frame1.id, null, 10),
    createStoreInventory(store1.id, frame2.id, null, 5),
    createStoreInventory(store1.id, null, singleVisionVariants[0].id, 12),
    createStoreInventory(store1.id, null, progressiveVariants[0].id, 6),

    // Store 2 — some other mix
    createStoreInventory(store2.id, frame2.id, null, 8),
    createStoreInventory(store2.id, null, singleVisionVariants[1].id, 10),
    createStoreInventory(store2.id, null, progressiveVariants[1].id, 4),
    createStoreInventory(store2.id, accessory1.id, null, 20),
    createStoreInventory(store2.id, contactLens1.id, null, 15)
  ]);

  const customer = await CreateCustomer('Hwang Soyoon', '99190495', 'sonder1199@gmail.com',store1.id );

  const eyeTest = await CreateEyeTest(customer.id, -1, -1, 2, 2, 0.5, 0.5, 0, 'Wear glasses regularly');

  const order1 = await prisma.order.create({
    data: {
      storeId: store1.id,
      customerId: customer.id,
      totalPrice: 260.00,
      staffInCharge: "Misu Optics - Yarmag Staff",
      staffNotes: "Frame and lens fitting completed.",
      items: {
        create: [
          {
            productId: frame1.id, // frame
            quantity: 1,
            unitPrice: 120.0,
            totalPrice: 120.0,
          },
          {
            lensDetailId: singleVisionVariants[0].id, // specific lens variant
            quantity: 2,
            unitPrice: 70.0,
            totalPrice: 140.0,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      storeId: store2.id,
      customerId: customer.id,
      totalPrice: 210.00,
      staffInCharge: "Misu Optics - Tara Staff",
      staffNotes: "Progressive lens with case.",
      items: {
        create: [
          {
            lensDetailId: progressiveVariants[0].id,
            quantity: 1,
            unitPrice: 150.0,
            totalPrice: 150.0,
          },
          {
            productId: accessory2.id, // eyeglass case
            quantity: 1,
            unitPrice: 60.0,
            totalPrice: 60.0,
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
}

// Clear old data
async function clearDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.storeInventory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.lensDetail.deleteMany();
  await prisma.product.deleteMany();
  await prisma.eyeTest.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
}

// Admin
async function createAdmin() {
  const hashedPassword = await bcrypt.hash("Mishka0525$", 10);
  return prisma.user.create({
    data: {
      firstName: "Sunderiya",
      lastName: "Admin",
      userRole: "ADMIN",
      email: "sunderiyabuyan@gmail.com",
      phoneNumber: "+610451711996",
      password: hashedPassword
    }
  });
}

// Store User
async function createStoreUser(firstName: string, lastName: string) {
  const hashedPassword = await bcrypt.hash("StoreUser123$", 10);
  return prisma.user.create({
    data: {
      firstName,
      lastName,
      userRole: "USER",
      email: `${firstName.toLowerCase()}@misuoptics.com`,
      phoneNumber: "+610400000000",
      password: hashedPassword
    }
  });
}

//  Store
async function createStore(userId: number, name: string, address: string) {
  return prisma.store.create({
    data: {
      userId,
      name,
      address
    }
  });
}

//  Product
async function createProduct(name: string, sku: string, brand: string, category: ProductCategory, costPrice: number, retailPrice: number) {
  return prisma.product.create({
    data: {
      name,
      sku,
      brand,
      category,
      costPrice,
      retailPrice
    }
  });
}

//  Lens Specification (LensDetail)
async function createLensSpecification(
  productId: number,
  sphere: number | null,
  cylinder: number | null,
  axis: number | null,
  addition: number | null,
  baseCurve: number | null,
  diameter: number | null,
  coating: string | null,
  material: string | null,
  type: string | null
) {
  return prisma.lensDetail.create({
    data: {
      productId,
      sphere,
      cylinder,
      axis,
      addition,
      baseCurve,
      diameter,
      coating,
      material,
      type
    }
  });
}

// Store Inventory
async function createStoreInventory(storeId: number, productId: number | null, lensDetailId: number | null, quantity: number) {
  return prisma.storeInventory.create({
    data: {
      storeId,
      productId,
      lensDetailId,
      quantity
    }
  });
}

async function CreateCustomer(name: string, phoneNumber: string, email: string, storeId: number) {
  return prisma.customer.create({
    data: {
      name,
      phoneNumber,
      email,
      storeId
    }
  });
}

async function CreateEyeTest(
    customerId: number,
    rightSphere: number,
    leftSphere: number,
    rightCylinder: number,
    leftCylinder: number,
    rightAddition: number,
    leftAddition: number,
    pupillaryDistance: number,
    notes: string
  ) {
    return prisma.eyeTest.create({
      data: {
        customerId,
        rightSphere,
        leftSphere,
        rightCylinder,
        leftCylinder,
        rightAddition,
        leftAddition,
        pupillaryDistance,
        notes
      }
    });
  }
  


// Run seeding
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
