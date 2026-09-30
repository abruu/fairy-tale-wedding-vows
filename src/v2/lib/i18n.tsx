import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

const STORAGE_KEY = "wedding-lang";

function readStoredLang(): Lang {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "ml" ? "ml" : "en";
  } catch {
    return "en";
  }
}

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

/**
 * English / Malayalam switch for the site. Defaults to English and
 * remembers the visitor's choice in localStorage (which can throw in private
 * mode, so every access is guarded). Also keeps <html lang> in sync so screen
 * readers and the :lang(ml) font rules follow the active language.
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — the choice just won't persist */
    }
  }, []);

  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, t: (key) => translations[lang][key] }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}

interface TProps {
  k: TranslationKey;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/** Translated text: <T k="hero.eyebrow" /> → <span data-i18n="hero.eyebrow" lang="…">…</span> */
export const T: React.FC<TProps> = ({ k, as: Tag = "span", className }) => {
  const { lang, t } = useLang();
  return (
    <Tag data-i18n={k} lang={lang} className={className}>
      {t(k)}
    </Tag>
  );
};

/**
 * Reads a bilingual config field: pick(couple, "brideName", "ml") returns
 * couple.brideName_ml, falling back to the English value.
 */
export function pick(obj: object, key: string, lang: Lang): string {
  const rec = obj as Record<string, unknown>;
  const v = rec[`${key}_${lang}`] ?? rec[`${key}_en`];
  return typeof v === "string" ? v : "";
}
