import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  const deadline = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // +60 jours

  const result = await prisma.jobOffer.updateMany({
    where: { status: "PUBLISHED" },
    data: { deadline },
  });

  console.log(`Offres prolongées jusqu'au ${deadline.toISOString().slice(0, 10)} : ${result.count}`);
  await prisma.$disconnect();
}

main();
