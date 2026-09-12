import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { DashboardTitle } from "@/components/dashboard-shell";
import { ProfileForm } from "@/components/candidate-forms";

export default function CandidatProfilPage() {
  return (
    <>
      <DashboardTitle title="Mon profil" description="Un profil complet augmente vos chances d'être repéré par les recruteurs." />
      <ProfileContent />
    </>
  );
}

async function ProfileContent() {
  const user = await requireRole("CANDIDATE");
  const [userFull, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { firstName: true, lastName: true, phone: true } }),
    prisma.candidateProfile.findUnique({ where: { id: user.candidateProfileId! } }),
  ]);

  const experiencesText = ((profile?.experiences as Array<Record<string, string>> | null) ?? [])
    .map((e) => [e.poste, e.entreprise, e.periode, e.description].filter(Boolean).join(" | "))
    .join("\n");
  const educationsText = ((profile?.educations as Array<Record<string, string>> | null) ?? [])
    .map((e) => [e.diplome, e.etablissement, e.annee].filter(Boolean).join(" | "))
    .join("\n");

  return (
    <div className="card">
      <ProfileForm
        data={{
          firstName: userFull?.firstName ?? "",
          lastName: userFull?.lastName ?? "",
          phone: userFull?.phone ?? null,
          title: profile?.title ?? null,
          summary: profile?.summary ?? null,
          skills: profile?.skills.join(", ") ?? "",
          languages: profile?.languages.join(", ") ?? "",
          educationLevel: profile?.educationLevel ?? null,
          sector: profile?.sector ?? null,
          city: profile?.city ?? null,
          country: profile?.country ?? null,
          experienceYears: profile?.experienceYears ?? 0,
          availability: profile?.availability ?? "IMMEDIATE",
          visibleInCvtheque: profile?.visibleInCvtheque ?? true,
          experiencesText,
          educationsText,
        }}
      />
    </div>
  );
}
