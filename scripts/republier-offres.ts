import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  const deadline = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // +60 jours

  const result = await prisma.jobOffer.updateMany({
    where: { status: "ARCHIVED" },
    data: { status: "PUBLISHED", deadline, publishedAt: new Date() },
  });

  console.log(`Offres archivées republiées : ${result.count}`);
  await prisma.$disconnect();
}

main();
