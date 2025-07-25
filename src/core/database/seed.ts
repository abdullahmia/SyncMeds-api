// import bcrypt from "bcryptjs";
// import { ulid } from "ulid";
// import {
//   InventoryStatus,
//   PaymentMethod,
//   PaymentStatus,
//   PrismaClient,
// } from "../../generated/prisma";

// const prisma = new PrismaClient();

// async function hashPassword(password: string): Promise<string> {
//   return await bcrypt.hash(password, 10);
// }

// async function main() {
//   console.log("🌱 Starting database seeding...");

//   // Clear existing data in safe order (children first)
//   console.log("🧹 Clearing existing data...");
//   await prisma.settings.deleteMany();
//   await prisma.saleItem.deleteMany();
//   await prisma.sale.deleteMany();
//   await prisma.inventory.deleteMany();
//   await prisma.product.deleteMany();
//   await prisma.customer.deleteMany();
//   await prisma.user.deleteMany();

//   // Seed Users
//   console.log("👥 Seeding users...");
//   const admin = await prisma.user.create({
//     data: {
//       name: "Admin User",
//       email: "admin@pharmacy.com",
//       password: await hashPassword("admin123"),
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   });

//   const pharmacist = await prisma.user.create({
//     data: {
//       name: "Pharmacist User",
//       email: "pharmacist@pharmacy.com",
//       password: await hashPassword("pharma123"),
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   });

//   // Seed Settings
//   console.log("⚙️ Seeding settings...");
//   await prisma.settings.create({
//     data: {
//       pharmacy_name: "City Pharmacy",
//       business_email: "info@citypharmacy.com",
//       business_address: "123 Main St, Cityville",
//       business_phone_number: "+1234567890",
//       registration_number: "PH123456",
//       tax_id: "TX987654",
//       currency: "USD",
//       currency_symbol: "$",
//       date_format: "MM/DD/YYYY",
//       time_zone: "America/New_York",
//       invoice_prefix: "INV",
//       invoice_footer: "Thank you for your business!",
//       payment_terms: "Due on receipt",
//       last_updated_by_id: admin.user_id,
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   });

//   // Seed Customers
//   console.log("👤 Seeding customers...");
//   const customer1 = await prisma.customer.create({
//     data: {
//       name: "John Doe",
//       email: "john@example.com",
//       phone: "+1234567891",
//       address: "456 Oak Ave, Townsville",
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   });

//   const customer2 = await prisma.customer.create({
//     data: {
//       name: "Jane Smith",
//       email: "jane@example.com",
//       phone: "+1234567892",
//       address: "789 Pine Rd, Villagetown",
//       created_at: new Date(),
//       updated_at: new Date(),
//     },
//   });

//   // Seed Products
//   console.log("💊 Seeding products...");
//   const products = await prisma.product.createMany({
//     data: [
//       {
//         product_id: ulid(),
//         product_name: "Paracetamol 500mg",
//         generic_name: "Acetaminophen",
//         description: "Pain reliever and fever reducer",
//         category: "Analgesic",
//         manufacturer: "Pharma Inc",
//         sku: "MED001",
//         selling_price: 5.99,
//         cost_price: 3.5,
//         required_prescription: false,
//         track_exprires: true,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         product_id: ulid(),
//         product_name: "Ibuprofen 200mg",
//         generic_name: "Ibuprofen",
//         description: "NSAID for pain and inflammation",
//         category: "Analgesic",
//         manufacturer: "MedCorp",
//         sku: "MED002",
//         selling_price: 7.5,
//         cost_price: 4.25,
//         required_prescription: false,
//         track_exprires: true,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         product_id: ulid(),
//         product_name: "Amoxicillin 250mg Capsules",
//         generic_name: "Amoxicillin",
//         description: "Antibiotic for bacterial infections",
//         category: "Antibiotic",
//         manufacturer: "HealthPlus",
//         sku: "MED003",
//         selling_price: 12.99,
//         cost_price: 8.5,
//         required_prescription: true,
//         track_exprires: true,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     ],
//   });

//   const productRecords = await prisma.product.findMany();

//   // Seed Inventory
//   console.log("📦 Seeding inventory...");
//   await prisma.inventory.createMany({
//     data: [
//       {
//         inventory_id: ulid(),
//         product_id: productRecords[0].product_id,
//         batch_number: "BATCH001",
//         quantity: 100,
//         location: "Shelf A1",
//         reorder_level: 20,
//         status: InventoryStatus.AVAILABLE,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         inventory_id: ulid(),
//         product_id: productRecords[1].product_id,
//         batch_number: "BATCH002",
//         quantity: 5,
//         location: "Shelf B2",
//         reorder_level: 10,
//         status: InventoryStatus.LOW_STOCK,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       {
//         inventory_id: ulid(),
//         product_id: productRecords[2].product_id,
//         batch_number: "BATCH003",
//         quantity: 35,
//         location: "Shelf C1",
//         reorder_level: 15,
//         status: InventoryStatus.AVAILABLE,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//     ],
//   });

//   // Seed Sales
//   console.log("💰 Seeding sales...");
//   const sale1 = await prisma.sale.create({
//     data: {
//       sale_id: ulid(),
//       invoice_number: "INV0001",
//       customer_id: customer1.customer_id,
//       user_id: admin.user_id,
//       sale_date: new Date(),
//       total_amount: 13.49,
//       payment_method: PaymentMethod.CARD,
//       payment_status: PaymentStatus.PAID,
//       notes: "Customer paid with credit card",
//       created_at: new Date(),
//       updated_at: new Date(),
//       SaleItem: {
//         create: [
//           {
//             sale_item_id: ulid(),
//             product_id: productRecords[0].product_id,
//             quantity_sold: 1,
//             unit_price: 5.99,
//             total_item: 5.99,
//             created_at: new Date(),
//           },
//           {
//             sale_item_id: ulid(),
//             product_id: productRecords[1].product_id,
//             quantity_sold: 1,
//             unit_price: 7.5,
//             total_item: 7.5,
//             created_at: new Date(),
//           },
//         ],
//       },
//     },
//   });

//   const sale2 = await prisma.sale.create({
//     data: {
//       sale_id: ulid(),
//       invoice_number: "INV0002",
//       customer_id: customer2.customer_id,
//       user_id: pharmacist.user_id,
//       sale_date: new Date(),
//       total_amount: 12.99,
//       payment_method: PaymentMethod.CASH,
//       payment_status: PaymentStatus.PAID,
//       notes: "Walk-in customer",
//       created_at: new Date(),
//       updated_at: new Date(),
//       SaleItem: {
//         create: [
//           {
//             sale_item_id: ulid(),
//             product_id: productRecords[2].product_id,
//             quantity_sold: 1,
//             unit_price: 12.99,
//             total_item: 12.99,
//             created_at: new Date(),
//           },
//         ],
//       },
//     },
//   });

//   console.log("✅ Database seeded successfully!");

//   // Verification
//   const saleWithRelations = await prisma.sale.findFirst({
//     where: { sale_id: sale1.sale_id },
//     include: {
//       user: true,
//       customer: true,
//       SaleItem: {
//         include: {
//           product: true,
//         },
//       },
//     },
//   });

//   console.log(
//     "🔍 Sample sale with relations:",
//     JSON.stringify(saleWithRelations, null, 2)
//   );
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seeding failed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from "@/generated/prisma";
import { ulid } from "ulid";
import { hashPassword } from "../auth/password.service";
const prisma = new PrismaClient();

async function main() {
  // Cleanup (order matters due to relations)
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // Create User
  const password = "Admin@123";
  const user = await prisma.user.create({
    data: {
      user_id: ulid(),
      name: "Admin User",
      email: "admin@pharmacy.com",
      password: await hashPassword(password),
    },
  });

  // Create Customer
  // const customer = await prisma.customer.create({
  //   data: {
  //     customer_id: ulid(),
  //     name: "John Doe",
  //     email: "john@example.com",
  //     phone: "1234567890",
  //     address: "123 Main Street",
  //   },
  // });

  // Create Products
  // const products = await Promise.all([
  //   prisma.product.create({
  //     data: {
  //       product_id: ulid(),
  //       product_name: "Paracetamol 500mg",
  //       generic_name: "Acetaminophen",
  //       description: "Pain reliever and fever reducer",
  //       category: "Analgesic",
  //       manufacturer: "Pharma Inc",
  //       sku: "MED001",
  //       selling_price: 5.99,
  //       cost_price: 3.5,
  //       required_prescription: false,
  //       track_exprires: true,
  //     },
  //   }),
  //   prisma.product.create({
  //     data: {
  //       product_id: ulid(),
  //       product_name: "Ibuprofen 200mg",
  //       generic_name: "Ibuprofen",
  //       description: "NSAID for pain and inflammation",
  //       category: "Analgesic",
  //       manufacturer: "MedCorp",
  //       sku: "MED002",
  //       selling_price: 7.5,
  //       cost_price: 4.25,
  //       required_prescription: false,
  //       track_exprires: true,
  //     },
  //   }),
  // ]);

  // Create Inventory for products
  // const inventories = await Promise.all(
  //   products.map((product, index) =>
  //     prisma.inventory.create({
  //       data: {
  //         inventory_id: ulid(),
  //         product_id: product.product_id,
  //         batch_number: `BATCH00${index + 1}`,
  //         quantity: 100,
  //         location: `Aisle ${index + 1}`,
  //         reorder_level: 20,
  //         status: InventoryStatus.AVAILABLE,
  //       },
  //     })
  //   )
  // );

  // Create Sale with SaleItems
  // const sale = await prisma.sale.create({
  //   data: {
  //     sale_id: ulid(),
  //     invoice_number: "INV-0001",
  //     customer_id: customer.customer_id,
  //     user_id: user.user_id,
  //     inventory_id: inventories[0].inventory_id,
  //     total_amount: 5.99 + 7.5,
  //     payment_method: PaymentMethod.CASH,
  //     payment_status: PaymentStatus.PAID,
  //     notes: "Initial test sale",
  //     SaleItem: {
  //       create: [
  //         {
  //           sale_item_id: ulid(),
  //           product_id: products[0].product_id,
  //           quantity_sold: 1,
  //           unit_price: 5.99,
  //           total_item: 1,
  //         },
  //         {
  //           sale_item_id: ulid(),
  //           product_id: products[1].product_id,
  //           quantity_sold: 1,
  //           unit_price: 7.5,
  //           total_item: 1,
  //         },
  //       ],
  //     },
  //   },
  // });

  console.log("🌱 Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
