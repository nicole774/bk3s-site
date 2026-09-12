import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DashboardTitle } from "@/components/dashboard-shell";
import { ArticleForm } from "@/components/admin-forms";

type Props = { params: Promise<{ id: string }> };

export default async function AdminArticleEditPage({ params }: Props) {
  await requireRole("ADMIN", "CONSULTANT", "EDITOR");
  const { id } = await params;

  if (id === "nouvelle") {
    return (
      <>
        <DashboardTitle
          title="Nouvel article"
          action={<Link href="/admin/actualites" className="btn btn-outline-navy btn-sm">← Actualités</Link>}
        />
        <div className="card">
          <ArticleForm data={{ title: "", category: "", excerpt: "", content: "", status: "DRAFT" }} />
        </div>
      </>
    );
  }

  const article = await prisma.newsArticle.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <>
      <DashboardTitle
        title={`Modifier : ${article.title}`}
        description={`/actualites/${article.slug}`}
        action={<Link href="/admin/actualites" className="btn btn-outline-navy btn-sm">← Actualités</Link>}
      />
      <div className="card">
        <ArticleForm
          data={{
            id: article.id,
            title: article.title,
            category: article.category,
            excerpt: article.excerpt,
            content: article.content,
            status: article.status,
          }}
        />
      </div>
    </>
  );
}
