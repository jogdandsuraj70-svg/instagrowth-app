import React from 'react';
import { Smartphone, ShieldCheck, Heart, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200/80 dark:border-gray-800 py-8 px-safe mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">
              OmniConnect Engine
            </span>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Strict Password Protection
            </span>
            <span>•</span>
            <span>Single URL Architecture</span>
            <span>•</span>
            <span>Safe Area Dynamic Inset</span>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} OmniConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
