import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';
import {
  LayoutDashboard,
  Utensils,
  FolderTree,
  HelpCircle,
  BarChart3,
  LogOut,
  ExternalLink,
  Shield,
  Sun,
  Moon
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Food Commodities', path: '/admin/foods', icon: <Utensils className="w-4 h-4" /> },
    { label: 'Categories', path: '/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
    { label: 'Quiz Questions', path: '/admin/quiz', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground transition-colors duration-300">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-emerald-900/10 dark:border-emerald-500/10 p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Logo & Admin Badge */}
          <div className="space-y-2">
            <Logo size="sm" showSubtitle={false} />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-[11px] font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Management System</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm dark:bg-emerald-600'
                      : 'text-slate-700 dark:text-emerald-100 hover:bg-emerald-500/10 hover:text-emerald-800 dark:hover:text-emerald-300'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-emerald-900/10 dark:border-emerald-500/10 space-y-3">
          
          {/* Admin User Info */}
          {user && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 space-y-0.5">
              <div className="text-xs font-bold text-slate-900 dark:text-emerald-100 font-heading truncate">
                {user.username}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-emerald-300/70 truncate">
                {user.email}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-900/10 dark:border-emerald-500/20"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-800" />}
            </button>

            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl text-slate-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-900/10 dark:border-emerald-500/20"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>

    </div>
  );
};
