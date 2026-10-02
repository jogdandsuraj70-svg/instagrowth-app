import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { detectDevice } from '../utils/deviceDetection';
import { Lock, Mail, User, ShieldCheck, ArrowRight, Globe, AlertCircle, KeyRound, Sparkles, TrendingUp } from 'lucide-react';
import OAuthConnectModal from '../components/OAuthConnectModal';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [oauthOpen, setOauthOpen] = useState(false);
  const [oauthProvider, setOauthProvider] = useState('Google');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dev = detectDevice();

    try {
      let res;
      if (mode === 'login') {
        res = await login(email, password, dev.platform);
      } else {
        res = await register(email, password, name, dev.platform);
      }

      if (res.success) {
        navigate(res.user.role === 'admin' ? '/admin' : from, { replace: true });
      } else {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err) {
      setError('An unexpected connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillUser = () => {
    setEmail('user@example.com');
    setPassword('Password123!');
    setMode('login');
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@instagrowth.com');
    setPassword('AdminPass123!');
    setMode('login');
  };

  const handleOpenOAuth = (provider) => {
    setOauthProvider(provider);
    setOauthOpen(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-purple-50/40 via-white to-gray-50 dark:from-gray-900 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white rounded-2xl shadow-md mb-1">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Sign In to InstaGrowth' : 'Create InstaGrowth Account'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Social Media Growth Management Platform
          </p>
        </div>

        {/* Quick Fill Pre-set Buttons for Demonstration */}
        <div className="p-3 bg-purple-50/60 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900 space-y-2 text-xs">
          <div className="flex items-center justify-between text-purple-900 dark:text-purple-300 font-semibold">
            <span>Quick Demo Sign In:</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickFillUser}
              className="py-1.5 px-2.5 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-100 transition active-press text-[11px]"
            >
              Fill User (@alex_growth)
            </button>
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="py-1.5 px-2.5 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 rounded-xl text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-100 transition active-press text-[11px]"
            >
              Fill Admin User
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode Switch Tabs */}
        <div className="bg-gray-100 dark:bg-gray-700/60 p-1 rounded-2xl flex text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md transition active-press flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Login' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gray-200 dark:border-gray-700 w-full"></div>
          <span className="bg-white dark:bg-gray-800 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider absolute">
            OAuth Authorization Options
          </span>
        </div>

        {/* Official OAuth Buttons */}
        <div className="space-y-2 text-xs">
          <button
            type="button"
            onClick={() => handleOpenOAuth('Google')}
            className="w-full py-2.5 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition active-press flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenOAuth('Meta / Instagram')}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold rounded-xl shadow-xs hover:opacity-95 transition active-press flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4 text-white" />
            <span>Connect Instagram (Official Meta OAuth)</span>
          </button>
        </div>

        {/* Security Guarantee Note */}
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 rounded-2xl text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Official OAuth Protocol:</strong> InstaGrowth uses official Meta/Instagram OAuth standards. We <strong>NEVER</strong> prompt for, collect, or store Instagram passwords.
          </p>
        </div>
      </div>

      <OAuthConnectModal
        isOpen={oauthOpen}
        onClose={() => setOauthOpen(false)}
        provider={oauthProvider}
        onSuccess={() => navigate(from, { replace: true })}
      />
    </div>
  );
}
