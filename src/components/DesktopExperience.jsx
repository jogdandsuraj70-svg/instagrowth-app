import React, { useState } from 'react';
import { Monitor, CheckCircle, Send, ShieldCheck, Cpu, Layers, ExternalLink, Activity, Terminal, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createSubmissionPayload } from '../utils/deviceDetection';
import { deviceService } from '../services/deviceService';
import { Link } from 'react-router-dom';

export default function DesktopExperience({ deviceInfo, onRefreshHistory }) {
  const { user, isAdmin } = useAuth();
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = createSubmissionPayload(user, notes);
      const res = await deviceService.submitDeviceRecord(payload);

      if (res.success) {
        setSuccessMsg(`Desktop payload submitted! Record ID: ${res.submission.id}`);
        setNotes('');
        if (onRefreshHistory) onRefreshHistory();
      } else {
        setErrorMsg(res.error || 'Failed to record desktop submission.');
      }
    } catch (err) {
      setErrorMsg('Network error while reaching server API.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700 shadow-lg p-6 sm:p-8 space-y-6">
      
      {/* Desktop Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
            <Monitor className="w-8 h-8 text-indigo-200" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-300">Desktop Workstation Mode</span>
            <h2 className="text-2xl font-black tracking-tight">{deviceInfo.osName} • {deviceInfo.browserName}</h2>
            <p className="text-xs text-indigo-200 mt-0.5">High-performance responsive workspace interface</p>
          </div>
        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition active-press text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open System Admin Dashboard</span>
          </Link>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700/40 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Submit Telemetry Record
            </h3>
            
            {successMsg && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  User Account / Session
                </label>
                <input
                  type="text"
                  readOnly
                  value={user ? `${user.name} (${user.email})` : 'Unauthenticated Guest'}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Submission Notes / Context
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter optional description or validation comments..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition active-press flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Record...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Telemetry Payload</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Column 3: Specs Widget */}
        <div className="bg-gray-50 dark:bg-gray-700/40 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700 space-y-4 text-xs">
          <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Environment Diagnostics
          </h3>
          
          <div className="space-y-3 divide-y divide-gray-200/60 dark:divide-gray-600">
            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Platform OS</span>
              <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.osName} {deviceInfo.osVersion}</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Browser</span>
              <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.browserName}</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Viewport</span>
              <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.screenResolution}</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Device Type</span>
              <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.deviceType}</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-gray-500">Pixel Density</span>
              <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.pixelRatio}x</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
