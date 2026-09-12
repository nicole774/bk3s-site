import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { deleteArticle } from "@/app/actions/admin";

const STATUS_TONES: Record<string, "gray" | "green" | "navy"> = { DRAFT: "gray", PUBLISHED: "green", ARCHIVED: "navy" };
const STATUS_LABELS: Record<string, string> = { DRAFT: "Brouillon", PUBLISHED: "Publié", ARCHIVED: "Archivé" };

export default async function AdminActualitesPage() {
  await requireRole("ADMIN", "CONSULTANT", "EDITOR");
  const articles = await prisma.newsArticle.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <DashboardTitle
        title="Actualités"
        description="Créer, publier, dépublier ou archiver les articles (§20)."
        action={<Link href="/admin/actualites/nouvelle" className="btn btn-gold">Nouvel article</Link>}
      />
      <div className="card">
        {articles.length === 0 ? (
          <EmptyState title="Aucun article" description="Publiez votre première actualité.">
            <Link href="/admin/actualites/nouvelle" className="btn btn-gold">Nouvel article</Link>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-gray-100">
            {articles.map((article) => (
              <li key={article.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="flex items-center gap-2 font-medium text-ink">
                    {article.title}
                    <Badge tone={STATUS_TONES[article.status]}>{STATUS_LABELS[article.status]}</Badge>
                  </p>
                  <p className="text-xs text-ink-soft">
                    {article.category ? `${article.category} · ` : ""}
                    {article.publishedAt ? `Publié le ${formatDate(article.publishedAt)}` : "Non publié"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/actualites/${article.id}`} className="btn btn-outline-navy btn-sm">Modifier</Link>
                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={article.id} />
                    <button type="submit" className="btn btn-danger btn-sm">Supprimer</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
