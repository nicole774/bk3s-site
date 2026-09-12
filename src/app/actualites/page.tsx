import Link from "next/link";

import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";

export const metadata = {
  title: "Actualités",
  description: "Actualités, conseils RH, annonces et événements de BK Dimension 3S Consulting.",
};

export default async function ActualitesPage() {
  const articles = await prisma.newsArticle.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="bg-navy-deep py-16 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Accueil / Actualités</p>
          <h1 className="mt-3 text-4xl font-semibold">Actualités</h1>
          <p className="mt-3 max-w-xl text-white/75">
            Actualités du cabinet, conseils RH, annonces et événements.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-bk">
          {articles.length === 0 ? (
            <EmptyState title="Aucune actualité publiée pour le moment" description="Revenez bientôt : nos articles arrivent." />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/actualites/${article.slug}`} className="card flex flex-col transition-shadow hover:border-gold/60 hover:shadow-md">
                  {article.category ? <Badge tone="navy" className="w-fit">{article.category}</Badge> : <span />}
                  <h2 className="mt-3 font-display text-lg font-semibold text-navy">{article.title}</h2>
                  {article.excerpt ? <p className="mt-2 flex-1 text-sm text-ink-soft">{article.excerpt}</p> : null}
                  <p className="mt-4 text-xs text-gray-400">Publié le {formatDate(article.publishedAt)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
