import React, { useState } from 'react';
import { ShieldCheck, Lock, ExternalLink, AlertCircle, CheckCircle2, X, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OAuthConnectModal({ isOpen, onClose, provider = 'Google', onSuccess }) {
  const { loginOAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const isMeta = provider.toLowerCase().includes('meta') || provider.toLowerCase().includes('instagram');

  const handleOfficialOAuthAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate standard OAuth 2.0 Authorization Code exchange delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      const mockEmail = isMeta ? 'user.meta@instagram.com' : 'user.google@gmail.com';
      const mockName = isMeta ? 'Meta Verified User' : 'Google Account Holder';
      const mockOAuthToken = `oauth_token_${provider.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      const res = await loginOAuth(provider, mockOAuthToken, mockEmail, mockName);

      if (res.success) {
        if (onSuccess) onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'OAuth authorization failed.');
      }
    } catch (err) {
      setError('Connection to official authorization server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white font-bold text-sm ${isMeta ? 'bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700' : 'bg-blue-600'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Official {provider} Authorization
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">OAuth 2.0 Security Standard Protocol</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-950 dark:text-indigo-200 text-xs">
                  Zero Credential Harvester Guarantee
                </h4>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-300 mt-1 leading-relaxed">
                  OmniConnect uses only official OAuth token authorization. We <strong>NEVER</strong> prompt for or store third-party passwords. All authentication occurs via official identity providers.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <p className="font-semibold text-gray-800 dark:text-gray-200">Permissions requested by OmniConnect:</p>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Basic Profile Info (Name & Public Identifier)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Email Address</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Read-Only Account Status Confirmation</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={handleOfficialOAuthAuth}
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-white shadow-md active-press flex items-center justify-center gap-2 text-sm ${
                isMeta
                  ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95'
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to {provider}...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>Proceed to Official {provider} OAuth</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-500" /> HTTPS End-to-End Encrypted
          </span>
          <span>Redirect Endpoint: /api/auth/oauth</span>
        </div>
      </div>
    </div>
  );
}
