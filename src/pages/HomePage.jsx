import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { detectDevice } from '../utils/deviceDetection';
import { TrendingUp, Users, Heart, BarChart3, Target, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Smartphone, Globe, Lock, ExternalLink } from 'lucide-react';
import OAuthConnectModal from '../components/OAuthConnectModal';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [deviceInfo] = useState(detectDevice());
  const [oauthOpen, setOauthOpen] = useState(false);

  return (
    <div className="bg-gradient-to-b from-purple-50/50 via-white to-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      
      {/* Device Responsive Header Banner (Subtle, non-intrusive) */}
      <div className="bg-white/80 dark:bg-gray-800/80 border-b border-purple-100 dark:border-gray-700/60 py-2 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap text-gray-600 dark:text-gray-300">
          <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Optimized for <strong>{deviceInfo.deviceType}</strong> ({deviceInfo.browserName} on {deviceInfo.platform})</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Meta OAuth Authorization Standard
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Next-Generation Social Media Growth Suite</span>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white">
            Insta<span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Growth</span>
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-300">
            Social Media Growth Management
          </p>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Data-driven engagement analytics, campaign tracking, audience demographic management, and official Meta OAuth social connection in one powerful dashboard.
          </p>
        </div>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/25 active-press flex items-center justify-center gap-2.5 text-base transition"
          >
            <span>{isAuthenticated ? "Go to Dashboard" : "Get Started"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md active-press flex items-center justify-center gap-2 text-base transition"
            >
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Hero Stats Card Simulation */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Users className="w-4 h-4 text-purple-600" /> Followers
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">12,480</p>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
                +14.2% this month
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Users className="w-4 h-4 text-indigo-600" /> Following
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">1,240</p>
              <span className="text-xs text-gray-400">Optimized Ratio</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-4 h-4 text-pink-600" /> Engagement
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">6.8%</p>
              <span className="text-xs text-emerald-600 font-bold">Industry Leader</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Target className="w-4 h-4 text-blue-600" /> Campaigns
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">3 Active</p>
              <span className="text-xs text-purple-600 font-bold">Scaling Reach</span>
            </div>

          </div>
        </div>
      </section>

      {/* Growth Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200/60 dark:border-gray-800 space-y-12">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Comprehensive Growth Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Professional UI & management tools built directly on top of official API standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Followers Growth */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Followers Growth</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Monitor daily follower acquisitions, demographic retention, organic growth trajectories, and subscriber conversion rates.
            </p>
          </div>

          {/* Card 2: Like Campaigns */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Like & Content Campaigns</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Design high-converting media schedules, track post-wise likes & saves, and optimize hashtags for maximum Explore page reach.
            </p>
          </div>

          {/* Card 3: Engagement Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Engagement Analytics</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Deep dive into comment ratios, story view completions, share frequency, and peak audience online hours.
            </p>
          </div>

          {/* Card 4: Post Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Post Analytics</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Analyze top-performing Reels, single photos vs carousel carousels performance, and viral coefficient indicators.
            </p>
          </div>

          {/* Card 5: Campaign Management */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Campaign Management</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Set growth targets, budget allocations, A/B caption tests, and target creator niche benchmarks.
            </p>
          </div>

          {/* Card 6: Connected Social Accounts */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Connected Social Accounts</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Seamlessly link your Instagram Business or Creator accounts via official Meta OAuth protocol with zero password risk.
            </p>
          </div>

        </div>

        {/* Security & Official OAuth Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5" /> Official Meta OAuth Authorization
            </div>
            <h3 className="text-2xl font-black tracking-tight">Zero Credential Interception</h3>
            <p className="text-xs text-purple-200 leading-relaxed">
              InstaGrowth strictly enforces official Meta OAuth standards. We <strong>NEVER</strong> request or store third-party passwords. All authorization happens directly on Meta's official secure authorization servers.
            </p>
          </div>

          <button
            onClick={() => setOauthOpen(true)}
            className="px-6 py-3.5 bg-white text-purple-900 hover:bg-purple-50 font-bold rounded-2xl shadow-lg transition active-press text-xs flex items-center gap-2 flex-shrink-0"
          >
            <Globe className="w-4 h-4 text-purple-600" />
            <span>Connect Instagram (Official OAuth)</span>
          </button>
        </div>
      </section>

      {/* Official OAuth Modal */}
      <OAuthConnectModal
        isOpen={oauthOpen}
        onClose={() => setOauthOpen(false)}
        provider="Meta / Instagram"
        onSuccess={() => navigate('/dashboard')}
      />
    </div>
  );
}
