import React from "react";
import { useLang } from "../../lib/i18n";
import type { Lang } from "../../lib/translations";

const OPTIONS: { lang: Lang; label: string; name: string }[] = [
  { lang: "en", label: "EN", name: "English" },
  { lang: "ml", label: "മലയാളം", name: "മലയാളം" },
];

/** English / മലയാളം segmented switch — lives in the fixed nav's top corner. */
export const LanguageToggle: React.FC = () => {
  const { lang, setLang, t } = useLang();
  return (
    <div className="v2-lang-toggle" role="group" aria-label={t("a11y.language")}>
      {OPTIONS.map((o) => (
        <button
          key={o.lang}
          type="button"
          lang={o.lang}
          className={lang === o.lang ? "active" : ""}
          aria-pressed={lang === o.lang}
          aria-label={o.name}
          onClick={() => setLang(o.lang)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};
