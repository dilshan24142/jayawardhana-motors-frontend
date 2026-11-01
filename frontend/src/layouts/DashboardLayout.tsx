import { useState } from "react";
import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

export function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className="layout__main">
        <Navbar onMenuClick={() => setMenuOpen((open) => !open)} />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
