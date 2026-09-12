import { requireRole } from "@/lib/auth";
import { DashboardTitle } from "@/components/dashboard-shell";
import { ChangePasswordForm, DeleteAccountForm } from "@/components/candidate-forms";

export default async function ComptePage() {
  const user = await requireRole("CANDIDATE");
  return (
    <>
      <DashboardTitle title="Mon compte" description={`Connecté en tant que ${user.email}.`} />
      <div className="card">
        <p className="eyebrow">Changer mon mot de passe</p>
        <div className="mt-3">
          <ChangePasswordForm />
        </div>
      </div>
      <div className="card mt-6 border-red-200">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-600">Supprimer mon compte</p>
        <div className="mt-3">
          <DeleteAccountForm />
        </div>
      </div>
    </>
  );
}
