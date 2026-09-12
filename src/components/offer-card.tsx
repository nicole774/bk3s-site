import Link from "next/link";
import { MapPin, Briefcase, CalendarClock } from "lucide-react";

import { Badge } from "@/components/ui";
import { CONTRACT_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export type OfferCardData = {
  id: string;
  title: string;
  location: string | null;
  contractType: keyof typeof CONTRACT_LABELS;
  deadline: Date | null;
  publishedAt: Date | null;
  sector: string | null;
  company: { name: string };
};

export function OfferCard({ offer }: { offer: OfferCardData }) {
  return (
    <Link
      href={`/offres/${offer.id}`}
      className="card flex flex-col gap-3 transition-shadow hover:border-gold/60 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-navy">{offer.title}</h3>
          <p className="text-sm text-ink-soft">{offer.company.name}</p>
        </div>
        <Badge tone="gold">{CONTRACT_LABELS[offer.contractType]}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
        {offer.location ? (
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} className="text-gold" /> {offer.location}
          </span>
        ) : null}
        {offer.sector ? (
          <span className="inline-flex items-center gap-1">
            <Briefcase size={14} className="text-gold" /> {offer.sector}
          </span>
        ) : null}
        {offer.deadline ? (
          <span className="inline-flex items-center gap-1">
            <CalendarClock size={14} className="text-gold" /> Date limite : {formatDate(offer.deadline)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
