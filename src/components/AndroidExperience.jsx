import React, { useState } from 'react';
import { Smartphone, CheckCircle, Send, ShieldCheck, Cpu, Layers, Plus, Compass, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createSubmissionPayload } from '../utils/deviceDetection';
import { deviceService } from '../services/deviceService';

export default function AndroidExperience({ deviceInfo, onRefreshHistory }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
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
        setSuccessMsg(`Android telemetry record logged! ID: ${res.submission.id}`);
        setNotes('');
        if (onRefreshHistory) onRefreshHistory();
      } else {
        setErrorMsg(res.error || 'Failed to complete submission.');
      }
    } catch (err) {
      setErrorMsg('Network connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#FEF7FF] dark:bg-[#141218] min-h-[85vh] rounded-[36px] border-[6px] border-gray-300 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col relative">
      
      {/* Android Top App Bar */}
      <div className="bg-[#6750A4] text-white p-5 shadow-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/15 rounded-2xl backdrop-blur-xs">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-200">Material Design 3</span>
            <h2 className="text-xl font-bold tracking-tight">Android Chrome</h2>
          </div>
        </div>
        <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold">
          {deviceInfo.browserName}
        </span>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-sm pb-20">
        
        {/* User Card */}
        <div className="bg-white dark:bg-[#211F26] p-5 rounded-3xl border border-purple-100 dark:border-purple-950 shadow-xs">
          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
            Verified Account
          </span>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {user ? user.email : 'Android Guest User'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Device Model: <strong className="text-gray-800 dark:text-gray-200">{deviceInfo.deviceType}</strong> ({deviceInfo.osName} {deviceInfo.osVersion})
          </p>
        </div>

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

        {activeTab === 'home' && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#211F26] p-5 rounded-3xl border border-purple-100 dark:border-purple-950 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Android Submission Form
            </h3>

            <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl text-xs space-y-1 font-mono text-gray-700 dark:text-gray-300">
              <div><strong>Brand:</strong> {deviceInfo.deviceType}</div>
              <div><strong>Resolution:</strong> {deviceInfo.screenResolution}</div>
              <div><strong>Browser:</strong> {deviceInfo.browserName}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                Note / Activity Description
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Android Chrome responsiveness verify..."
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#141218] border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#6750A4] hover:bg-[#533e85] text-white font-bold rounded-2xl shadow-md active-press flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Android Payload</span>
                </>
              )}
            </button>
          </form>
        )}

        {activeTab === 'specs' && (
          <div className="bg-white dark:bg-[#211F26] p-5 rounded-3xl border border-purple-100 dark:border-purple-950 shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Android Diagnostics
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Android Version</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.osVersion}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Manufacturer / Line</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.deviceType}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Browser Environment</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.browserName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Viewport Metrics</span>
                <span className="font-semibold text-gray-900 dark:text-white">{deviceInfo.screenResolution}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Material Bottom Nav */}
      <div className="absolute bottom-0 inset-x-0 bg-[#F3EDF7] dark:bg-[#211F26] border-t border-purple-100 dark:border-purple-950 px-6 py-2 flex justify-around items-center z-40">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-4 rounded-2xl transition-all ${
            activeTab === 'home'
              ? 'bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-purple-100'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Send className="w-5 h-5" />
          <span>Submit</span>
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-4 rounded-2xl transition-all ${
            activeTab === 'specs'
              ? 'bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-purple-100'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <span>Specs</span>
        </button>
      </div>
    </div>
  );
}
