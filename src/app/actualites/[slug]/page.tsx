import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({ where: { slug }, select: { title: true, excerpt: true } });
  if (!article) return { title: "Article introuvable" };
  return { title: article.title, description: article.excerpt ?? undefined };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({ where: { slug } });
  if (!article || article.status !== "PUBLISHED") notFound();

  return (
    <>
      <section className="bg-navy-deep py-14 text-white">
        <div className="container-bk">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            <Link href="/actualites" className="hover:text-gold-light">Actualités</Link> / Article
          </p>
          {article.category ? <Badge tone="gold" className="mt-4">{article.category}</Badge> : null}
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">{article.title}</h1>
          <p className="mt-3 text-sm text-white/60">Publié le {formatDate(article.publishedAt)}</p>
        </div>
      </section>
      <article className="py-14">
        <div className="container-bk mx-auto max-w-3xl">
          {article.excerpt ? <p className="mb-6 text-lg text-ink-soft">{article.excerpt}</p> : null}
          <div className="whitespace-pre-line leading-relaxed text-ink-soft">{article.content}</div>
        </div>
      </article>
    </>
  );
}
