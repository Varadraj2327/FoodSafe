import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useTheme } from '../../context/useTheme';
import { useAuth } from '../../context/useAuth';
import { Sun, Moon, Menu, X, Search, Heart, User as UserIcon, Shield, LogOut, UserPlus, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Food Commodities', path: '/foods' },
    { label: 'Search Database', path: '/search' },
    { label: 'Safety Quiz', path: '/quiz' },
    ...(isAuthenticated ? [
      { label: 'My Favorites', path: '/favorites' },
      { label: 'User Profile', path: '/profile' }
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-emerald-900/10 dark:border-emerald-500/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-emerald-950/5 dark:bg-emerald-900/20 p-1.5 rounded-2xl border border-emerald-900/10 dark:border-emerald-500/10">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm dark:bg-emerald-600'
                      : 'text-slate-700 dark:text-emerald-100 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-500/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Search Shortcut */}
            <button
              onClick={() => navigate('/search')}
              aria-label="Open Search"
              className="p-2.5 rounded-xl text-slate-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-900/10 dark:border-emerald-500/20 transition-colors"
              title="Search Food Database"
            >
              <Search className="w-4 h-4 text-emerald-800 dark:text-emerald-300" />
            </button>

            {/* Favorites Link */}
            {isAuthenticated && (
              <button
                onClick={() => navigate('/favorites')}
                aria-label="Favorites"
                className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                title="My Favorite Commodities"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Profile / Login Links */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(user?.is_admin ? '/admin' : '/profile')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold text-emerald-900 dark:text-emerald-100 transition-colors"
                  title="Account Settings"
                >
                  {user?.is_admin ? <Shield className="w-4 h-4 text-emerald-600" /> : <UserIcon className="w-4 h-4 text-emerald-600" />}
                  <span className="max-w-[100px] truncate">{user?.full_name || user?.username}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-900/10 dark:border-emerald-500/20 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </button>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl text-slate-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-900/10 dark:border-emerald-500/20 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-800" />
              )}
            </button>
          </div>

          {/* Mobile Menu Trigger & Theme Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-900/10 dark:border-emerald-500/20"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-800" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-emerald-100 hover:bg-emerald-500/10 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-emerald-900/10 dark:border-emerald-500/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-800 text-white dark:bg-emerald-600'
                    : 'text-slate-700 dark:text-emerald-100 hover:bg-emerald-500/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-700 text-white"
                >
                  Create Account
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10"
              >
                Sign Out ({user?.username})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
