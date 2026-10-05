import React from 'react';
import { Building2, RotateCcw, Printer, BookOpen, Sparkles } from 'lucide-react';
import { PRESET_DEALS } from '../data/presets';
import { DealInputs } from '../types/deal';

interface HeaderProps {
  onSelectPreset: (inputs: DealInputs) => void;
  onReset: () => void;
  onOpenGuide: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onReset,
  onOpenGuide,
  onPrint,
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Brand Zone: Clean wordmark & entity title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 flex items-center justify-center text-white shadow-inner border border-blue-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                  Baruch-Ermi LLC
                </span>
                <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-blue-400 font-semibold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                  Acquisitions
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Creative Financing Offer Generator
              </p>
            </div>
          </div>

          {/* Quick Presets for Investors */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Presets:
            </span>
            {PRESET_DEALS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.inputs)}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors whitespace-nowrap"
                title={preset.description}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Actions Zone */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              title="Creative Financing Strategy & Terminology Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Strategy Guide</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              title="Print Deal Summary & Terms"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={onReset}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1"
              title="Reset fields to blank"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
