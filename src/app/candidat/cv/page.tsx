import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatFileSize, formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { CvUploadForm, DocumentActions } from "@/components/candidate-forms";

const TYPE_LABELS: Record<string, string> = {
  CV: "CV",
  MOTIVATION: "Lettre de motivation",
  CERTIFICATE: "Certificat / diplôme",
  OTHER: "Autre",
};

export default async function CandidatCvPage() {
  const user = await requireRole("CANDIDATE");
  const documents = await prisma.document.findMany({
    where: { candidateId: user.candidateProfileId! },
    orderBy: [{ type: "asc" }, { isPrimary: "desc" }, { createdAt: "desc" }],
    select: { id: true, type: true, filename: true, size: true, isPrimary: true, createdAt: true },
  });

  return (
    <>
      <DashboardTitle
        title="Mon CV & mes documents"
        description="Déposez, remplacez, téléchargez ou supprimez vos documents à tout moment (§9)."
      />

      <div className="card">
        <p className="eyebrow">Déposer un document</p>
        <div className="mt-3">
          <CvUploadForm />
        </div>
      </div>

      <div className="card mt-6">
        <p className="eyebrow">Mes documents</p>
        {documents.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Aucun document déposé" description="Déposez votre CV pour pouvoir postuler aux offres." />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-gray-100">
            {documents.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-ink">
                    {doc.filename}
                    {doc.isPrimary ? <Badge tone="gold">Principal</Badge> : null}
                  </p>
                  <p className="text-xs text-gray-400">
                    {TYPE_LABELS[doc.type]} · {formatFileSize(doc.size)} · déposé le {formatDate(doc.createdAt)}
                  </p>
                </div>
                <DocumentActions documentId={doc.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
