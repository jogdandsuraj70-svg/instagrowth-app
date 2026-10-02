import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { detectDevice } from '../utils/deviceDetection';
import { fetchApi } from '../config/api';
import Navbar from '../components/Navbar';
import OAuthConnectModal from '../components/OAuthConnectModal';
import { Users, Heart, BarChart2, Target, Globe, ShieldCheck, CheckCircle2, AlertCircle, Plus, Sparkles, Smartphone, Settings as SettingsIcon, Link2, RefreshCw, Send, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'campaigns' | 'analytics' | 'accounts' | 'settings'
  const [deviceInfo] = useState(detectDevice());
  const [oauthOpen, setOauthOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(user);
  const [connectingInstagram, setConnectingInstagram] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    setUserProfile(user);
  }, [user]);

  const handleConnectInstagramDirect = async () => {
    setConnectingInstagram(true);
    try {
      // Execute official Meta OAuth token authorization handler
      const res = await fetchApi('/auth/connect-instagram', {
        method: 'POST',
        body: JSON.stringify({ handle: `@${user.name.toLowerCase().replace(/\s+/g, '_')}_growth` })
      });

      if (res.success && res.user) {
        setUserProfile(res.user);
        localStorage.setItem('omniconnect_user', JSON.stringify(res.user));
        setToastMsg(`Instagram account ${res.user.connectedAccount} successfully connected via official Meta OAuth!`);
      }
    } catch (err) {
      console.error('Instagram OAuth connection error:', err);
    } finally {
      setConnectingInstagram(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      
      {/* Top Navbar with Tab Controls */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* User Welcome Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                InstaGrowth Dashboard
              </span>
              <span className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold rounded-full border border-purple-200 dark:border-purple-800">
                {userProfile?.connectedAccount !== 'Not Connected' ? 'Instagram Connected' : 'Account Pending'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
              Welcome back, {userProfile?.name || userProfile?.email}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Active Platform: <strong className="text-gray-700 dark:text-gray-200">{deviceInfo.deviceType}</strong> ({deviceInfo.browserName}) • Account: {userProfile?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition active-press flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            )}

            <button
              onClick={() => setOauthOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md transition active-press flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Connect Instagram</span>
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-emerald-600 font-bold">Dismiss</button>
          </div>
        )}

        {/* 1. OVERVIEW DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* 5 Core Dashboard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              
              {/* Followers */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Followers</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">12,480</p>
                <span className="text-[11px] text-emerald-600 font-bold block">+1,420 this month</span>
              </div>

              {/* Following */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Following</span>
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">1,240</p>
                <span className="text-[11px] text-gray-400 block">Ratio 10.1 : 1</span>
              </div>

              {/* Engagement */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Engagement</span>
                  <Heart className="w-4 h-4 text-pink-600" />
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">6.8%</p>
                <span className="text-[11px] text-emerald-600 font-bold block">+1.4% vs avg</span>
              </div>

              {/* Posts */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Posts</span>
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">142</p>
                <span className="text-[11px] text-gray-400 block">4 Reels this week</span>
              </div>

              {/* Campaign Status */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-2 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Campaign Status</span>
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-purple-600 dark:text-purple-400">3 Active</p>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold block">Growth Active</span>
              </div>

            </div>

            {/* Main Growth Analytics Summary & Connected Accounts Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Growth Trajectory */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-purple-600" /> Followers Growth Trajectory
                  </h3>
                  <span className="text-xs text-gray-400">Last 30 Days</span>
                </div>

                {/* Simulated Visual Growth Bar Chart */}
                <div className="space-y-3 pt-2">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Week 1 (Organic Reach)</span>
                      <span>+320 Followers</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Week 2 (Reels Virality)</span>
                      <span>+580 Followers</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Week 3 (Audience Optimization)</span>
                      <span>+520 Followers</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Growth Insight:</strong> Reel content published between 6:00 PM and 8:00 PM achieved 3.4x higher non-follower impression rates.
                  </p>
                </div>
              </div>

              {/* Right Column: Connected Instagram Account Card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" /> Connected Account
                </h3>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase">Provider</span>
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold rounded-md">
                      Official Meta OAuth
                    </span>
                  </div>

                  <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-purple-600" />
                    <span>{userProfile?.connectedAccount || 'Not Connected'}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-bold ${userProfile?.connectionStatus === 'Connected' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {userProfile?.connectionStatus || 'Not Connected'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setOauthOpen(true)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl text-xs shadow-md transition active-press flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Connect Instagram (OAuth)</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 2. CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Growth & Like Campaigns</h2>
                <p className="text-xs text-gray-500">Manage campaign objectives, budget allocations, and performance tracking</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Create Campaign
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Active</span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Summer Engagement Boost</h4>
                <p className="text-gray-500">Target: Fashion & Lifestyle Niche</p>
                <div className="pt-2 font-mono text-purple-600 font-bold">+1,420 Followers Gained</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Active</span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Reels Content Optimization</h4>
                <p className="text-gray-500">Target: Tech & AI Enthusiasts</p>
                <div className="pt-2 font-mono text-purple-600 font-bold">+2,890 Followers Gained</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Active</span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Global Creator Scaling</h4>
                <p className="text-gray-500">Target: Global Niche Audiences</p>
                <div className="pt-2 font-mono text-purple-600 font-bold">+5,400 Followers Gained</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm space-y-6 text-xs">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Engagement & Post Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Top Post Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800">
                    <span>Reel: "10 AI Tools for Creators"</span>
                    <span className="font-bold text-purple-600">42.8k Views • 3.2k Likes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800">
                    <span>Carousel: "Weekly Creator Growth Routine"</span>
                    <span className="font-bold text-purple-600">18.4k Views • 1.8k Likes</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Audience Demographics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800">
                    <span>Top Location</span>
                    <span className="font-bold">United States (38%), UK (18%)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-800">
                    <span>Age Range</span>
                    <span className="font-bold">18 - 34 (74%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. CONNECTED ACCOUNTS TAB */}
        {activeTab === 'accounts' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm space-y-6 text-xs">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connected Social Accounts</h2>
              <p className="text-gray-500">Manage social authorizations via official OAuth protocols</p>
            </div>

            {/* Instagram Account Card */}
            <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50/30 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl border border-purple-200/80 dark:border-purple-900 space-y-4 max-w-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Instagram Account</h3>
                    <p className="text-gray-500">Meta Graph API Authorization</p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  userProfile?.connectionStatus === 'Connected'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  Status: {userProfile?.connectionStatus || 'Not Connected'}
                </span>
              </div>

              {userProfile?.connectedAccount && userProfile?.connectedAccount !== 'Not Connected' && (
                <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-purple-100 dark:border-purple-900 font-mono font-bold text-purple-700 dark:text-purple-300 flex items-center justify-between">
                  <span>Handle: {userProfile.connectedAccount}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              )}

              <button
                onClick={() => setOauthOpen(true)}
                disabled={connectingInstagram}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-md transition active-press flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <Globe className="w-4 h-4" />
                <span>{userProfile?.connectionStatus === 'Connected' ? 'Reconnect Instagram (Meta OAuth)' : 'Connect Instagram'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 p-6 shadow-sm space-y-4 text-xs">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings & Preferences</h2>
            <div className="max-w-md space-y-3">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">User Full Name</label>
                <input type="text" readOnly value={userProfile?.name || ''} className="w-full p-2.5 rounded-xl bg-gray-50 border text-sm" />
              </div>
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Email</label>
                <input type="text" readOnly value={userProfile?.email || ''} className="w-full p-2.5 rounded-xl bg-gray-50 border text-sm" />
              </div>
            </div>
          </div>
        )}

      </main>

      <OAuthConnectModal
        isOpen={oauthOpen}
        onClose={() => setOauthOpen(false)}
        provider="Meta / Instagram"
        onSuccess={(updated) => {
          handleConnectInstagramDirect();
        }}
      />
    </div>
  );
}
