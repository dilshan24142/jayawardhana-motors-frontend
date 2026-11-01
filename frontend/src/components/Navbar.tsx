import { useLocation } from "react-router";
import { NAV_ITEMS } from "../config/navigation";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { pathname } = useLocation();
  const current = NAV_ITEMS.find((item) =>
    item.path === "/" ? pathname === "/" : pathname.startsWith(item.path),
  );

  return (
    <header className="navbar">
      <button type="button" className="navbar__menu" onClick={onMenuClick} aria-label="Open menu">
        Menu
      </button>
      <span className="navbar__title">{current?.label ?? "Jayawardhana Motors"}</span>
      {/* JM-08: show the signed-in user and a Log out button here. */}
    </header>
  );
}
