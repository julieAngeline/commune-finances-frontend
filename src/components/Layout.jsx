import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Coins, PiggyBank, Receipt, BookOpen,
  LogOut, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menus = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/exercices', label: 'Exercices', icon: CalendarDays },
  { to: '/recettes', label: 'Recettes', icon: Coins },
  { to: '/budgets', label: 'Budgets dépenses', icon: PiggyBank },
  { to: '/depenses', label: 'Dépenses', icon: Receipt },
  { to: '/budgets-recettes', label: 'Prévisions recettes', icon: PiggyBank },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ---------- THÈME ----------
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const current = menus.find((m) => pathname.startsWith(m.to));

  return (
    <div className="app-shell">
      {/* ===== SIDEBAR (tout à gauche) ===== */}
      <aside className="sidebar">
        <h3 className="sidebar-title">Commune Finances</h3>
        <nav>
          {menus.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ===== ZONE DROITE : TOPBAR + CONTENU ===== */}
      <div className="main-area">
        <header className="topbar">
          <strong>{current?.label || ''}</strong>

          <div className="topbar-right">
            <button className="icon-btn" title="Changer de thème"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Clair' : 'Sombre'}
            </button>
            <span>{user?.name}</span>
            <button className="icon-btn"
              onClick={async () => { await logout(); navigate('/login'); }}>
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}