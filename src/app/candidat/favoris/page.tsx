import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { OfferCard } from "@/components/offer-card";

export default async function FavorisPage() {
  const user = await requireRole("CANDIDATE");
  const favorites = await prisma.favorite.findMany({
    where: { candidateId: user.candidateProfileId! },
    orderBy: { createdAt: "desc" },
    include: { offer: { include: { company: { select: { name: true, logo: true, logoMime: true } } } } },
  });

  return (
    <>
      <DashboardTitle title="Mes offres favorites" description="Les offres que vous avez mises de côté." />
      {favorites.length === 0 ? (
        <EmptyState title="Aucun favori" description="Ajoutez des offres à vos favoris depuis leur fiche détaillée.">
          <Link href="/offres" className="btn btn-gold">Explorer les offres</Link>
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favorites.map((f) => (
            <OfferCard key={f.offer.id} offer={f.offer} />
          ))}
        </div>
      )}
    </>
  );
}
