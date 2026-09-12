import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { DashboardTitle } from "@/components/dashboard-shell";
import { CreateUserForm } from "@/components/admin-forms";
import { setUserStatus, setUserRole } from "@/app/actions/admin";

type Search = { q?: string; role?: string };

const STATUS_TONES: Record<string, "green" | "red"> = { ACTIVE: "green", SUSPENDED: "red" };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const me = await requireRole("ADMIN", "CONSULTANT", "EDITOR");
  const { q, role } = await searchParams;

  const users = await prisma.user.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { firstName: { contains: q, mode: "insensitive" as const } },
              { lastName: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(role && Object.keys(ROLE_LABELS).includes(role) ? { role: role as never } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const isAdmin = me.role === "ADMIN";

  return (
    <>
      <DashboardTitle title="Utilisateurs" description={`${users.length} compte(s) — création, suspension et rôles (§15.1).`} />

      <div className="card">
        <p className="eyebrow">Créer un membre de l&apos;équipe</p>
        {isAdmin ? (
          <div className="mt-3">
            <CreateUserForm />
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">Seul un administrateur peut créer des comptes.</p>
        )}
      </div>

      <form className="mt-6 flex flex-wrap gap-2" action="/admin/utilisateurs" method="get">
        <input name="q" defaultValue={q ?? ""} className="input w-auto flex-1" placeholder="Nom ou e-mail…" />
        <select name="role" defaultValue={role ?? ""} className="input w-auto">
          <option value="">Tous les rôles</option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-outline-navy btn-sm">Filtrer</button>
      </form>

      <div className="card mt-4">
        {users.length === 0 ? (
          <EmptyState title="Aucun utilisateur trouvé" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="th">Utilisateur</th>
                  <th className="th">Rôle</th>
                  <th className="th">Statut</th>
                  <th className="th">Inscrit le</th>
                  {isAdmin ? <th className="th">Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="td">
                      <p className="font-medium text-ink">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-ink-soft">{user.email}</p>
                    </td>
                    <td className="td">
                      {isAdmin ? (
                        <form action={setUserRole} className="flex gap-1">
                          <input type="hidden" name="userId" value={user.id} />
                          <select name="role" defaultValue={user.role} className="input w-auto py-1 text-xs">
                            {Object.entries(ROLE_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                          <button type="submit" className="btn btn-outline-navy btn-sm">OK</button>
                        </form>
                      ) : (
                        <Badge tone="navy">{ROLE_LABELS[user.role]}</Badge>
                      )}
                    </td>
                    <td className="td"><Badge tone={STATUS_TONES[user.status]}>{user.status === "ACTIVE" ? "Actif" : "Suspendu"}</Badge></td>
                    <td className="td text-ink-soft">{formatDate(user.createdAt)}</td>
                    {isAdmin ? (
                      <td className="td">
                        {user.id !== me.id ? (
                          <form action={setUserStatus}>
                            <input type="hidden" name="userId" value={user.id} />
                            <input type="hidden" name="status" value={user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"} />
                            <button type="submit" className={user.status === "ACTIVE" ? "btn btn-danger btn-sm" : "btn btn-gold btn-sm"}>
                              {user.status === "ACTIVE" ? "Suspendre" : "Réactiver"}
                            </button>
                          </form>
                        ) : (
                          <span className="text-xs text-gray-400">Vous</span>
                        )}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
