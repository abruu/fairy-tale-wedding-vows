import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { CrossMotif } from "../shared/CrossMotif";

interface NavItem {
  id: string;
  label: string;
}

interface NavigationProps {
  items: NavItem[];
  activeSection: string;
  onNavigate: (id: string) => void;
}

/**
 * Thin fixed-top blurred-dark nav bar with a gold-underline active
 * indicator and a cross-motif logo mark. Always stays visible/sticky —
 * never hides on scroll, only gains a stronger backdrop once scrolled.
 */
export const Navigation: React.FC<NavigationProps> = ({ items, activeSection, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrolled } = useScrollDirection(10);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <motion.nav
      className={`v2-nav ${scrolled ? "scrolled" : ""} ${mobileOpen ? "open" : ""}`}
      aria-label="Main navigation"
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <CrossMotif size={16} className="v2-nav-logo" />

      <div className="v2-nav-links">
        {items.map((item) => (
          <button
            key={item.id}
            className={`v2-nav-link ${activeSection === item.id ? "active" : ""}`}
            onClick={() => handleNavClick(item.id)}
            aria-current={activeSection === item.id ? "true" : undefined}
          >
            {item.label}
          </button>
        ))}
      </div>

      <span className="v2-nav-mobile-label">{items.find((it) => it.id === activeSection)?.label || "Menu"}</span>
      <button className="v2-nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </motion.nav>
  );
};
