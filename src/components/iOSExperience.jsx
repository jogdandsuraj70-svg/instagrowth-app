import React, { useState } from 'react';
import { Smartphone, CheckCircle, Send, ShieldCheck, Cpu, Wifi, History, Lock, ChevronRight, Layers, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createSubmissionPayload } from '../utils/deviceDetection';
import { deviceService } from '../services/deviceService';

export default function iOSExperience({ deviceInfo, onRefreshHistory }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submit');
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
        setSuccessMsg(`Submission recorded! Record ID: ${res.submission.id}`);
        setNotes('');
        if (onRefreshHistory) onRefreshHistory();
      } else {
        setErrorMsg(res.error || 'Failed to complete submission.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to reach backend API.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-100 dark:bg-black min-h-[85vh] rounded-[40px] border-[6px] border-gray-300 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col pt-safe pb-safe relative">
      
      {/* Dynamic Island / Notch Representation */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black dark:bg-gray-900 rounded-full z-50 flex items-center justify-between px-2.5 shadow-inner">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80 animate-pulse"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-gray-700"></span>
      </div>

      {/* iOS Header */}
      <div className="pt-9 px-6 pb-4 glass-ios border-b border-gray-200/50 dark:border-gray-800 flex items-center justify-between sticky top-0 z-40">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase">iOS Safe-Area Experience</span>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
            <Smartphone className="w-6 h-6 text-sky-500" />
            <span>iPhone Safari</span>
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <span className="px-2.5 py-1 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs rounded-full">
            {deviceInfo.browserName}
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5">Safari WebKit</span>
        </div>
      </div>

      {/* iOS Segmented Control Tabs */}
      <div className="p-4 bg-gray-100 dark:bg-black">
        <div className="bg-gray-200/80 dark:bg-gray-800/80 p-1 rounded-2xl flex text-xs font-semibold">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'submit'
                ? 'bg-white dark:bg-gray-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Submit Data
          </button>
          <button
            onClick={() => setActiveTab('device')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'device'
                ? 'bg-white dark:bg-gray-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Device Specs
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'security'
                ? 'bg-white dark:bg-gray-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            iOS Safe Area
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-sm">
        
        {activeTab === 'submit' && (
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200/70 dark:border-gray-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Authentication State</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full">
                  Authenticated User
                </span>
              </div>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {user ? user.email : 'Guest Session'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Submissions update the central Admin Dashboard in real-time.
              </p>
            </div>

            {/* Notifications */}
            {successMsg && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-red-800 dark:text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200/70 dark:border-gray-800 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-500" /> Record iOS Device Telemetry
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Detected Device & Browser Payload
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl font-mono text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  <div><strong className="text-gray-400">Platform:</strong> iOS ({deviceInfo.osVersion})</div>
                  <div><strong className="text-gray-400">Model:</strong> {deviceInfo.deviceType}</div>
                  <div><strong className="text-gray-400">Browser:</strong> {deviceInfo.browserName}</div>
                  <div><strong className="text-gray-400">Viewport:</strong> {deviceInfo.screenResolution}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Custom Submission Note (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. iPhone Safari responsive layout test..."
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-md active-press flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit iOS Record</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'device' && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200/70 dark:border-gray-800 shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-500" /> Complete iOS Device Metrics
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Operating System</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.osName} {deviceInfo.osVersion}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Device Hardware</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.deviceType}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Active Engine</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.browserName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Screen Resolution</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.screenResolution}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Device Pixel Ratio</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.pixelRatio}x</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Multi-Touch Support</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{deviceInfo.maxTouchPoints} Points</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200/70 dark:border-gray-800 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-500" /> iOS Safe Area & Compliance
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              This application automatically respects iPhone Dynamic Island, top notch, and Safari bottom bar padding using standard CSS <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">env(safe-area-inset-*)</code> variables.
            </p>
            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-900 text-sky-800 dark:text-sky-300 font-mono">
              <div>padding-top: env(safe-area-inset-top);</div>
              <div>padding-bottom: env(safe-area-inset-bottom);</div>
            </div>
          </div>
        )}

      </div>

      {/* iOS Home Indicator */}
      <div className="h-4 bg-gray-100 dark:bg-black flex items-center justify-center pb-1">
        <div className="w-32 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
}
