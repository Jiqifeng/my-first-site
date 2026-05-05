import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const inviteCode = process.env.SEED_INVITE_CODE ?? "WELCOME-INVITE-001";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      passwordHash,
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.inviteCode.upsert({
    where: { code: inviteCode },
    update: {
      enabled: true,
      usedAt: null,
      usedByUserId: null,
      createdById: admin.id,
      expiresAt: null,
    },
    create: {
      code: inviteCode,
      createdById: admin.id,
      enabled: true,
    },
  });

  // eslint-disable-next-line no-console
  console.log(`Seed complete. Admin: ${adminEmail}, invite: ${inviteCode}`);
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
