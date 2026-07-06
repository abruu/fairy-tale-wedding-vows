import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";

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
 * Floating glassmorphism navigation with auto-hide and mobile menu.
 */
export const Navigation: React.FC<NavigationProps> = ({
  items,
  activeSection,
  onNavigate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollDir, scrolled } = useScrollDirection(10);

  // Hide nav on scroll down (after 300px), show on scroll up
  const hidden = scrollDir === "down" && scrolled && !mobileOpen;

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <nav
      className={`v2-nav ${scrolled ? "scrolled" : ""} ${hidden ? "hidden" : ""} ${mobileOpen ? "open" : ""}`}
      aria-label="Main navigation"
    >
      {/* Desktop links */}
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

      {/* Mobile label + toggle */}
      <span className="v2-nav-mobile-label">
        {items.find((it) => it.id === activeSection)?.label || "Menu"}
      </span>
      <button
        className="v2-nav-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </nav>
  );
};
