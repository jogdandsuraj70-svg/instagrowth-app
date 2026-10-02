import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { fetchApi } from '../config/api';
import { ShieldCheck, Users, Globe, Target, Activity, Search, Filter, RefreshCw, Trash2, Eye, Download, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, X, ShieldAlert, Smartphone } from 'lucide-react';

export default function AdminPage() {
  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Metrics
      const metricsRes = await adminService.getMetrics();
      if (metricsRes.success) {
        setMetrics(metricsRes.metrics);
      } else {
        setError(metricsRes.error || 'Failed to load admin metrics.');
      }

      // 2. Fetch Users List
      const usersRes = await fetchApi(`/admin/users?search=${encodeURIComponent(search)}&platform=${platformFilter}`);
      if (usersRes.success) {
        setUsersList(usersRes.users || []);
      }

      // 3. Fetch Submissions
      const subRes = await adminService.getSubmissions({ search, platform: platformFilter });
      if (subRes.success) {
        setSubmissions(subRes.submissions || []);
      }
    } catch (err) {
      setError('Connection failure while loading Admin Portal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, platformFilter]);

  const exportUsersCSV = () => {
    if (!usersList.length) return;
    const headers = ['User ID', 'Email', 'Platform', 'Connected Account', 'Connection Status', 'Created At', 'Last Activity'];
    const rows = usersList.map(u => [
      u.id,
      u.email,
      u.platform || 'Desktop',
      u.connectedAccount || 'Not Connected',
      u.connectionStatus || 'Not Connected',
      u.createdAt || '',
      u.lastLogin || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `instagrowth_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
            <ShieldCheck className="w-8 h-8 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase tracking-wider rounded-full border border-emerald-500/30">
                InstaGrowth Admin
              </span>
              <span className="text-xs text-purple-200">Server-Side Protection</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mt-1">Admin Dashboard</h1>
            <p className="text-xs text-purple-200 mt-0.5">Authorized Platform Data & Connected Accounts Management</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs backdrop-blur-xs border border-white/20 transition active-press flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportUsersCSV}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg transition active-press flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-600">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl text-red-800 dark:text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 5 Required Metrics Overview Cards */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{metrics.totalUsers}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Active Users</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{metrics.activeUsers}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Connected Accounts</span>
              <Globe className="w-4 h-4 text-pink-600" />
            </div>
            <p className="text-3xl font-black text-purple-600 dark:text-purple-400">{metrics.connectedAccounts}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Total Campaigns</span>
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{metrics.totalCampaigns}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Recent Activity</span>
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{metrics.recentActivity}</p>
          </div>

        </div>
      )}

      {/* Authorized Users & Connected Accounts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-sm overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 sm:p-6 border-b border-gray-200/80 dark:border-gray-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by User ID, Email, Handle..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-600 dark:text-gray-400">Platform:</span>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium focus:outline-none"
            >
              <option value="all">All Devices</option>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
              <option value="desktop">Desktop</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-500 dark:text-gray-400 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200/80 dark:border-gray-700">
              <tr>
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Connected Account</th>
                <th className="py-3.5 px-4">Connection Status</th>
                <th className="py-3.5 px-4">Created At</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    Loading admin records...
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-400">
                    No matching user records found.
                  </td>
                </tr>
              ) : (
                usersList.map((usr) => (
                  <tr key={usr.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-400">{usr.id}</td>
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">{usr.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {usr.platform || 'Desktop'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">
                      {usr.connectedAccount || 'Not Connected'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 font-bold text-[10px] rounded-full ${
                        usr.connectionStatus === 'Connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {usr.connectionStatus || 'Not Connected'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                      {new Date(usr.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                      {usr.lastLogin ? new Date(usr.lastLogin).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedUser(usr)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                User & Connected Account Specs
              </h3>
              <button onClick={() => setSelectedUser(null)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-1 font-mono text-gray-700 dark:text-gray-300">
              <div><strong>User ID:</strong> {selectedUser.id}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Platform:</strong> {selectedUser.platform || 'Desktop'}</div>
              <div><strong>Connected Account:</strong> {selectedUser.connectedAccount || 'Not Connected'}</div>
              <div><strong>Status:</strong> {selectedUser.connectionStatus || 'Not Connected'}</div>
              <div><strong>Created At:</strong> {selectedUser.createdAt}</div>
              <div><strong>Last Login:</strong> {selectedUser.lastLogin}</div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 text-[11px]">
              <ShieldCheck className="w-4 h-4 inline mr-1 text-emerald-600" />
              <strong>Zero Secret Interception Guarantee:</strong> Passwords and OAuth access tokens are salt-hashed or omitted from admin view.
            </div>

            <div className="pt-2 text-right">
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
