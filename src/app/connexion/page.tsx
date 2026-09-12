import Link from "next/link";
import Image from "next/image";

import { LoginForm } from "@/components/auth-forms";

export const metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <div className="bg-cream">
      <div className="container-bk flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="mb-6 flex flex-col items-center text-center">
              <Image src="/logo.jpeg" alt="Logo BK 3S Consulting" width={64} height={64} className="h-16 w-16 rounded-full object-cover ring-2 ring-gold/60" />
              <h1 className="mt-4 text-2xl font-semibold">Connexion</h1>
              <p className="mt-1 text-sm text-ink-soft">Accédez à votre espace candidat, entreprise ou administrateur.</p>
            </div>
            <LoginForm />
          </div>
          <p className="mt-6 text-center text-sm text-ink-soft">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-semibold text-navy hover:text-gold">
              Créer un compte candidat
            </Link>{" "}
            ou{" "}
            <Link href="/inscription-entreprise" className="font-semibold text-navy hover:text-gold">
              entreprise
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
