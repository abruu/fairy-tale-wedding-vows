import { WEDDING_CONFIG } from "@/config/dates";
import { pick } from "./i18n";
import type { Lang } from "./translations";

export type Role = "bride" | "groom";

export interface Person {
  role: Role;
  /** Short name (hero, nav) */
  name: string;
  nameEn: string;
  nameMl: string;
  /** Full name (profile card) */
  fullNameEn: string;
  fullNameMl: string;
  nakshatram: string;
  parents: string;
  tharavad: string;
  nativePlace: string;
  photo: string;
}

function person(role: Role, lang: Lang): Person {
  const c = WEDDING_CONFIG.couple;
  return {
    role,
    name: pick(c, `${role}Name`, lang),
    nameEn: pick(c, `${role}Name`, "en"),
    nameMl: pick(c, `${role}Name`, "ml"),
    fullNameEn: pick(c, `${role}FullName`, "en") || pick(c, `${role}Name`, "en"),
    fullNameMl: pick(c, `${role}FullName`, "ml") || pick(c, `${role}Name`, "ml"),
    nakshatram: pick(c, `${role}Nakshatram`, lang),
    parents: pick(c, `${role}Parents`, lang),
    tharavad: pick(c, `${role}Tharavad`, lang),
    nativePlace: pick(c, `${role}NativePlace`, lang),
    photo: role === "bride" ? c.bridePhoto : c.groomPhoto,
  };
}

/** Bride and groom in display order (see couple.brideFirst). */
export function couplePeople(lang: Lang): [Person, Person] {
  const bride = person("bride", lang);
  const groom = person("groom", lang);
  return WEDDING_CONFIG.couple.brideFirst ? [bride, groom] : [groom, bride];
}
