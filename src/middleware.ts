import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "bk3s_session";

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-me");

const ROLE_HOME: Record<string, string> = {
  CANDIDATE: "/candidat",
  COMPANY: "/entreprise",
  ADMIN: "/admin",
  CONSULTANT: "/admin",
  EDITOR: "/admin",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(COOKIE_NAME)?.value;
  let role: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret());
      role = typeof payload.role === "string" ? payload.role : null;
    } catch {
      role = null;
    }
  }

  // Utilisateur déjà connecté : on redirige les pages d'authentification vers son espace.
  if (role && (pathname === "/connexion" || pathname.startsWith("/inscription"))) {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/", req.url));
  }

  const needsAuth =
    pathname.startsWith("/candidat") || pathname.startsWith("/entreprise") || pathname.startsWith("/admin");

  if (!needsAuth) return NextResponse.next();

  if (!role) {
    const loginUrl = new URL("/connexion", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowed =
    (pathname.startsWith("/candidat") && role === "CANDIDATE") ||
    (pathname.startsWith("/entreprise") && role === "COMPANY") ||
    (pathname.startsWith("/admin") && ["ADMIN", "CONSULTANT", "EDITOR"].includes(role));

  if (!allowed) {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/candidat/:path*",
    "/entreprise/:path*",
    "/admin/:path*",
    "/connexion",
    "/inscription",
    "/inscription-entreprise",
  ],
};
