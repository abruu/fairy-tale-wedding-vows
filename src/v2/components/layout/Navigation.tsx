import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { useLang } from "../../lib/i18n";
import { couplePeople } from "../../lib/couple";
import type { TranslationKey } from "../../lib/translations";
import { LanguageToggle } from "./LanguageToggle";

export interface NavItem {
  id: string;
  label: TranslationKey;
}

interface NavigationProps {
  items: NavItem[];
  activeSection: string;
  onNavigate: (id: string) => void;
}

/**
 * Sticky minimal nav: the couple's initials on the left, section links (collapsing
 * to a hamburger panel under 1200px) and the language switch on the right.
 * Transparent over the hero, gains an ivory backdrop once scrolled.
 */
export const Navigation: React.FC<NavigationProps> = ({ items, activeSection, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrolled } = useScrollDirection(10);
  const { t } = useLang();
  // Initials monogram ("A&A") keeps the bar compact on phones in both languages
  const [first, second] = couplePeople("en");

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <nav className={`v2-nav ${scrolled || mobileOpen ? "scrolled" : ""}`} aria-label="Main navigation">
      <button
        type="button"
        className="v2-nav-brand"
        lang="en"
        aria-label={`${first.nameEn} & ${second.nameEn} · ${t("a11y.home")}`}
        onClick={() => handleNavClick(items[0].id)}
      >
        {first.nameEn[0]}
        <span className="v2-nav-amp">&amp;</span>
        {second.nameEn[0]}
      </button>

      <ul id="v2-nav-links" className={`v2-nav-links ${mobileOpen ? "open" : ""}`}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`v2-nav-link ${activeSection === item.id ? "active" : ""}`}
              aria-current={activeSection === item.id ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
            >
              {t(item.label)}
            </a>
          </li>
        ))}
      </ul>

      <div className="v2-nav-actions">
        <LanguageToggle />
        <button
          type="button"
          className="v2-nav-toggle"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
          aria-expanded={mobileOpen}
          aria-controls="v2-nav-links"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
};
