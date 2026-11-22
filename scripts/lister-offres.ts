import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  const offers = await prisma.jobOffer.findMany({
    select: { title: true, status: true, deadline: true },
    orderBy: { createdAt: "asc" },
  });
  for (const o of offers) {
    console.log(o.status.padEnd(16), "|", o.title, "|", o.deadline?.toISOString().slice(0, 10));
  }
  await prisma.$disconnect();
}

main();
