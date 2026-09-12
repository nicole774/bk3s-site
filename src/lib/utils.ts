export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export function formatDateShort(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

/** Génère une référence d'offre du type BK3S-2026-00042 */
export function generateOfferReference() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000 + 10000);
  return `BK3S-${year}-${rand}`;
}

const MAX_UPLOAD = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateUpload(file: File): string | null {
  if (file.size === 0) return "Fichier vide.";
  if (file.size > MAX_UPLOAD) return "Fichier trop volumineux (maximum 5 Mo).";
  if (!ALLOWED_MIME.includes(file.type)) return "Format non autorisé (PDF ou Word uniquement).";
  return null;
}

export function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function optionalStr(formData: FormData, key: string): string | null {
  const v = str(formData, key);
  return v.length > 0 ? v : null;
}

/**
 * Parse des listes textuelles au format "un élément par ligne",
 * champs séparés par « | » (ex. : Poste | Entreprise | 2021-2023 | Description).
 */
export function parseLines(value: string, expectedFields: number) {
  return value
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts.some((p) => p.length > 0))
    .map((parts) => (parts.length >= expectedFields ? parts : [...parts, ...Array(expectedFields - parts.length).fill("")]));
}
