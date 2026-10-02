import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, ShieldCheck, LogOut, LogIn, Menu, X, LayoutDashboard, Target, BarChart2, Link2, Settings, User } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboardPage = location.pathname === '/dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'accounts', label: 'Connected Accounts', icon: Link2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 sticky top-0 z-40 px-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 active-press">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                InstaGrowth
              </span>
              <span className="text-[10px] font-semibold text-gray-400 block -mt-1 tracking-wider uppercase">
                Social Growth Management
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link
              to="/"
              className={`transition ${location.pathname === '/' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Overview
            </Link>

            {isAuthenticated && (
              <>
                {isDashboardPage && activeTab ? (
                  <div className="flex items-center gap-4 text-xs">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                            active
                              ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                              : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <Link
                    to="/dashboard"
                    className={`transition ${isDashboardPage ? 'text-purple-600 font-bold' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'}`}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold transition hover:bg-purple-100 ${
                  location.pathname === '/admin' ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Profile / Auth Action */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <span className="font-bold text-gray-900 dark:text-white block">{user.name || user.email}</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">{user.connectedAccount || 'Instagram'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 font-bold text-xs hover:text-purple-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md transition active-press"
                >
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 pt-3 pb-6 bg-white dark:bg-gray-900 space-y-3 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Home Overview
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Dashboard
              </Link>
              {isDashboardPage && setActiveTab && (
                <div className="pl-4 space-y-1 text-xs">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                      className="block w-full text-left py-2 px-3 rounded-lg text-gray-600 dark:text-gray-400 hover:text-purple-600"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            {isAuthenticated ? (
              <>
                <div className="text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">{user.email}</span>
                  <span className="text-[10px] text-purple-600 block">Status: {user.connectionStatus || 'Active'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-center text-xs"
              >
                Login / Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
