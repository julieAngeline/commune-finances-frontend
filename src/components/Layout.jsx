import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import {
  LayoutDashboard, CalendarDays, Coins, ClipboardList, Receipt, TrendingUp,
  LogOut, Settings, User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { nomAffiche } from '../utils/format';
import cufLogo from '../assets/cuf.jpg';


const menus = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/exercices', label: 'Exercices', icon: CalendarDays },
  { to: '/recettes', label: 'Recettes', icon: Coins },
  { to: '/budgets', label: 'Budgets dépenses', icon: ClipboardList },
  { to: '/depenses', label: 'Dépenses', icon: Receipt },
  { to: '/budgets-recettes', label: 'Prévisions recettes', icon: TrendingUp },
  { to: '/assistant', label: 'Assistant IA', icon: Bot },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.removeItem('theme');
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {/* ===== SIDEBAR ===== */}
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

        <div className="side-bottom">
          <span className="side-section">Général</span>
          <NavLink to="/parametres"
            className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}>
            <Settings size={18} />
            Paramètres
          </NavLink>
          <button className="side-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>

        <div className="side-logo">
          <img src={cufLogo} alt="Commune Urbaine de Fianarantsoa" />
        </div>
      </aside>

      {/* ===== ZONE DROITE ===== */}
      <div className="main-area">
        {/* Barre du haut : uniquement l'utilisateur, à droite */}
        <header className="topbar" style={{ justifyContent: 'flex-end' }}>
          <span className="topbar-user">
            <span className="topbar-avatar"><User size={16} /></span>
            {nomAffiche(user?.name)}
          </span>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}