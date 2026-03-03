import { prisma } from "../src/config/prisma.js";
import { ProductCategory, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

async function main() {
  await clearDatabase();

  // Admin (platform-level)
  const admin = await createAdmin();

  // Business owner
  const owner = await createOwner("Misu", "Optics");


  // Business
  const business = await createBusiness("Misu Optics", owner.id);


  
  // Attach owner to business
  await prisma.user.update({
    where: { id: owner.id },
    data: { businessId: business.id },
  });

  const staff1 = await prisma.user.create({
    data: {
      firstName: "Alice",
      lastName: "Staff",
      email: "alice@misuoptics.com",
      phoneNumber: "0400000002",
      password: await bcrypt.hash("Staff123$", 10),
      userRole: "STAFF",
      businessId: business.id,
    },
  });
  
  const staff2 = await prisma.user.create({
    data: {
      firstName: "Bob",
      lastName: "Staff",
      email: "bob@misuoptics.com",
      phoneNumber: "0400000003",
      password: await bcrypt.hash("Staff123$", 10),
      userRole: "STAFF",
      businessId: business.id,
    },
  });

  // Stores
  const store1 = await createStore(
    business.id,
    "Misu Optics - Yarmag",
    "Yarmag"
  );
  const store2 = await createStore(
    business.id,
    "Misu Optics - Tara",
    "Tara"
  );

  await prisma.store.update({
    where: { id: store1.id },
    data: {
      staff: {
        connect: [{ id: staff1.id }],
      },
    },
  });
  
  await prisma.store.update({
    where: { id: store2.id },
    data: {
      staff: {
        connect: [{ id: staff2.id }],
      },
    },
  });
  
  // Products
  const frame1 = await createProduct(
    business.id,
    "Raybans Black Frame",
    "MIS123456",
    "Rayban",
    ProductCategory.FRAME,
    20,
    50
  );

  const frame2 = await createProduct(
    business.id,
    "GentleMonster Frame",
    "MIS342356",
    "Gentle Monster",
    ProductCategory.FRAME,
    25,
    90
  );

  const lens1 = await createProduct(
    business.id,
    "Single Vision Lens",
    "MIS987654",
    "Essilor",
    ProductCategory.LENSE,
    15,
    40
  );

  const lens2 = await createProduct(
    business.id,
    "Progressive Lens",
    "MIS456789",
    "Hoya",
    ProductCategory.LENSE,
    30,
    80
  );

  const accessory = await createProduct(
    business.id,
    "Cleaning Cloth",
    "MIS112233",
    "OptiClean",
    ProductCategory.ACCESSORIES,
    5,
    10
  );

  // Lens variants
  const singleVision = await createLensDetail(
    lens1.id,
    -1.0,
    -0.5,
    180,
    null,
    4.0,
    70,
    "AR Coating",
    "Plastic",
    "Single Vision"
  );

  const progressive = await createLensDetail(
    lens2.id,
    1.5,
    -0.75,
    170,
    2.0,
    5.0,
    72,
    "Blue Light",
    "High Index",
    "Progressive"
  );

  // Inventory
  await createStoreInventory(store1.id, frame1.id, null, 10);
  await createStoreInventory(store1.id, null, singleVision.id, 12);
  await createStoreInventory(store2.id, frame2.id, null, 8);
  await createStoreInventory(store2.id, null, progressive.id, 6);
  await createStoreInventory(store2.id, accessory.id, null, 20);

  // Customer
  const customer = await createCustomer(
    business.id,
    store1.id,
    "Hwang Soyoon",
    "99190495",
    "sonder1199@gmail.com"
  );

  // Eye test
  await createEyeTest(customer.id, -1, -1, 2, 2, 0.5, 0.5, 0, "Regular wear");

  // Order
  await prisma.order.create({
    data: {
      storeId: store1.id,
      customerId: customer.id,
      totalPrice: 260,
      staffInCharge: "Yarmag Staff",
      items: {
        create: [
          {
            productId: frame1.id,
            quantity: 1,
            unitPrice: 120,
            totalPrice: 120,
          },
          {
            lensDetailId: singleVision.id,
            quantity: 2,
            unitPrice: 70,
            totalPrice: 140,
          },
        ],
      },
    },
  });
}

async function clearDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.storeInventory.deleteMany();
  await prisma.lensDetail.deleteMany();
  await prisma.product.deleteMany();
  await prisma.eyeTest.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.store.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();
}

async function createAdmin() {
  return prisma.user.create({
    data: {
      firstName: "Sunderiya",
      lastName: "Admin",
      email: "admin@misu.app",
      phoneNumber: "+61000000001",
      password: await bcrypt.hash("Admin123$", 10),
      userRole: UserRole.ADMIN,
    },
  });
}

async function createOwner(firstName: string, lastName: string) {
  return prisma.user.create({
    data: {
      firstName,
      lastName,
      email: "owner@misuoptics.com",
      phoneNumber: "+61000000002",
      password: await bcrypt.hash("Owner123$", 10),
      userRole: UserRole.OWNER,
    },
  });
}


async function createBusiness(name: string, ownerId: number) {
  return prisma.business.create({
    data: {
      name,
      ownerId,
    },
  });
}



async function createStore(
  businessId: number,
  name: string,
  address: string
) {
  return prisma.store.create({
    data: {
      businessId,
      name,
      address,
    },
  });
}


async function createProduct(
  businessId: number,
  name: string,
  sku: string,
  brand: string,
  category: ProductCategory,
  costPrice: number,
  retailPrice: number
) {
  return prisma.product.create({
    data: {
      businessId,
      name,
      sku,
      brand,
      category,
      costPrice,
      retailPrice,
    },
  });
}

async function createLensDetail(
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
      type,
    },
  });
}

async function createStoreInventory(
  storeId: number,
  productId: number | null,
  lensDetailId: number | null,
  quantity: number
) {
  return prisma.storeInventory.create({
    data: {
      storeId,
      productId,
      lensDetailId,
      quantity,
    },
  });
}

async function createCustomer(
  businessId: number,
  storeId: number,
  name: string,
  phoneNumber: string,
  email: string
) {
  return prisma.customer.create({
    data: {
      businessId,
      storeId,
      name,
      phoneNumber,
      email,
    },
  });
}

async function createEyeTest(
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
      notes,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
