import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log("formations:", await prisma.formation.count());
  } catch (e) {
    console.log("ERREUR formations:", (e as Error).message.slice(0, 200));
  }

  const checks: Array<[string, () => Promise<number>]> = [
    ["jobOffers", () => prisma.jobOffer.count()],
    ["companies", () => prisma.company.count()],
    ["users", () => prisma.user.count()],
    ["candidateProfiles", () => prisma.candidateProfile.count()],
  ];
  for (const [label, fn] of checks) {
    try {
      console.log(label + ":", await fn());
    } catch (e) {
      console.log("ERREUR " + label + ":", (e as Error).message.slice(0, 300));
    }
  }

  await prisma.$disconnect();
}

main();
