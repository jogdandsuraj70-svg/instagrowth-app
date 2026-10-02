import React from 'react';
import { Smartphone, Monitor, Tablet, ShieldCheck, Cpu, Compass, Layers, CheckCircle2 } from 'lucide-react';

export default function DeviceDetectorBanner({ deviceInfo, viewMode, setViewMode }) {
  if (!deviceInfo) return null;

  const getDeviceIcon = () => {
    if (deviceInfo.isIOS) return <Smartphone className="w-5 h-5 text-sky-500" />;
    if (deviceInfo.isAndroid) return <Smartphone className="w-5 h-5 text-emerald-500" />;
    if (deviceInfo.isTablet) return <Tablet className="w-5 h-5 text-purple-500" />;
    return <Monitor className="w-5 h-5 text-indigo-500" />;
  };

  const getPlatformBadge = () => {
    if (deviceInfo.isIOS) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300">
          iOS Platform ({deviceInfo.osVersion})
        </span>
      );
    }
    if (deviceInfo.isAndroid) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
          Android Platform ({deviceInfo.osVersion})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300">
        Desktop Platform ({deviceInfo.osName})
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm p-4 sm:p-5 mb-6 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700/60 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl">
            {getDeviceIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Detected: {deviceInfo.deviceType}
              </h3>
              {getPlatformBadge()}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Active Browser: <strong className="text-gray-700 dark:text-gray-200">{deviceInfo.browserName}</strong> • Resolution: {deviceInfo.screenResolution}
            </p>
          </div>
        </div>

        {/* Interactive Mode Selector for Testing & Demonstration */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setViewMode('auto')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'auto'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Auto-Detect ({deviceInfo.platform})
          </button>
          <button
            onClick={() => setViewMode('ios')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'ios'
                ? 'bg-sky-500 text-white shadow-xs font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Preview iOS
          </button>
          <button
            onClick={() => setViewMode('android')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'android'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Preview Android
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'desktop'
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            Preview Desktop
          </button>
        </div>
      </div>

      {/* Metric Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <Compass className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <div>
            <span className="text-gray-400 block text-[10px] uppercase tracking-wider font-semibold">User Agent</span>
            <span className="font-mono text-gray-700 dark:text-gray-300 truncate block max-w-[120px]" title={deviceInfo.userAgent}>
              {deviceInfo.browserName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <Cpu className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <div>
            <span className="text-gray-400 block text-[10px] uppercase tracking-wider font-semibold">Touch & Inset</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {deviceInfo.hasTouch ? `${deviceInfo.maxTouchPoints} Touch Pt` : 'No Touch'} • {deviceInfo.hasSafeArea ? 'Safe Area' : 'Standard'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <Layers className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <div>
            <span className="text-gray-400 block text-[10px] uppercase tracking-wider font-semibold">Orientation</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">
              {deviceInfo.orientation} (DPR {deviceInfo.pixelRatio}x)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold block text-[11px]">Single URL Engine</span>
            <span className="text-emerald-600 dark:text-emerald-500 text-[10px]">Zero App Installs Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
