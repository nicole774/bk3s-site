import Link from "next/link";

import { logout } from "@/app/actions/auth";
import { cn, initials } from "@/lib/utils";

export type NavItem = { href: string; label: string; exact?: boolean };

/** Coquille commune des espaces personnel (candidat / entreprise / admin). */
export function DashboardShell({
  nav,
  user,
  badge,
  unread,
  children,
}: {
  nav: NavItem[];
  user: { firstName: string; lastName: string; role: string };
  badge: string;
  unread?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-cream">
      <div className="container-bk grid gap-8 py-10 lg:grid-cols-[250px_1fr]">
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="card bg-navy text-white">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold font-display text-lg font-semibold text-navy-deep">
              {initials(user.firstName, user.lastName)}
            </span>
            <p className="mt-3 text-center font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-center text-xs text-gold-light uppercase tracking-wider">{badge}</p>
          </div>

          <nav className="card mt-4 p-2" aria-label="Menu de l'espace">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-ink-soft hover:bg-cream hover:text-navy"
                  >
                    {item.label}
                    {item.label === "Notifications" && unread ? (
                      <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-white">{unread}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
            <form action={logout} className="border-t border-gray-100 p-2">
              <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                Se déconnecter
              </button>
            </form>
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export function DashboardTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4")}>
      <div>
        <h1 className="text-2xl font-semibold text-navy">{title}</h1>
        {description ? <p className="mt-1 text-sm text-ink-soft">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
