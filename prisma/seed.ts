import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const customerPassword = await bcrypt.hash("customer123", 12);

  await prisma.user.upsert({
    where: { email: "admin@aquaflow.store" },
    update: {},
    create: {
      email: "admin@aquaflow.store",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@aquaflow.store" },
    update: {},
    create: {
      email: "customer@aquaflow.store",
      name: "Jane Smith",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  console.log(
    "Seed complete: admin@aquaflow.store / admin123, customer@aquaflow.store / customer123",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
