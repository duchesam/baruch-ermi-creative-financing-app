import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ViabilityAlert } from './components/ViabilityAlert';
import { DealForm } from './components/DealForm';
import { MetricsCards } from './components/MetricsCards';
import { CashFlowWaterfall } from './components/CashFlowWaterfall';
import { PitchGeneratorPanel } from './components/PitchGeneratorPanel';
import { StrategyGuideModal } from './components/StrategyGuideModal';
import { PrintableDealSheet } from './components/PrintableDealSheet';
import { DealInputs } from './types/deal';
import { calculateDeal } from './utils/calculator';
import { PRESET_DEALS } from './data/presets';
import { Sparkles, ArrowDown, HelpCircle, Shield, Check } from 'lucide-react';

const INITIAL_DEAL: DealInputs = {
  propertyAddress: '1428 Elmwood Court, Charlotte, NC 28205',
  purchasePrice: 345000,
  estimatedARV: 375000,
  dealStructure: 'Subject-To (Existing Mortgage)',
  existingMortgageBalance: 290000,
  monthlyPayment: 1320,
  proposedDownPayment: 25000,
  proposedTerms: 'Take over existing 3.125% fixed FHA loan. 3rd-party servicer auto-pay.',
  monthlyMarketRent: 2450,
  estimatedRehab: 0,
  closingCostPercent: 3,
  buyerEntity: 'Baruch-Ermi LLC',
  buyerName: 'Acquisitions Director',
  buyerPhone: '(555) 392-8104',
  buyerEmail: 'acquisitions@baruch-ermi.com',
  closingDays: 21,
  inspectionPeriodDays: 7,
};

const BLANK_DEAL: DealInputs = {
  propertyAddress: '',
  purchasePrice: 0,
  estimatedARV: 0,
  dealStructure: 'Subject-To (Existing Mortgage)',
  existingMortgageBalance: 0,
  monthlyPayment: 0,
  proposedDownPayment: 0,
  proposedTerms: '',
  monthlyMarketRent: 0,
  estimatedRehab: 0,
  closingCostPercent: 3,
  buyerEntity: 'Baruch-Ermi LLC',
  buyerName: 'Acquisitions Director',
  buyerPhone: '(555) 392-8104',
  buyerEmail: 'acquisitions@baruch-ermi.com',
  closingDays: 21,
  inspectionPeriodDays: 7,
};

export default function App() {
  const [inputs, setInputs] = useState<DealInputs>(INITIAL_DEAL);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Recalculate metrics whenever inputs change
  const results = useMemo(() => calculateDeal(inputs), [inputs]);

  const handleSelectPreset = (presetInputs: DealInputs) => {
    setInputs(presetInputs);
    showToast('Loaded scenario preset successfully');
  };

  const handleReset = () => {
    setInputs(BLANK_DEAL);
    showToast('All fields cleared');
  };

  const handlePrint = () => {
    window.print();
  };

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  const scrollToPitch = () => {
    const el = document.getElementById('pitch-generator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Header
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onOpenGuide={() => setIsGuideOpen(true)}
        onPrint={handlePrint}
      />

      {/* Printable Term Sheet for standard browser print */}
      <PrintableDealSheet inputs={inputs} results={results} />

      {/* Main Application Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 no-print">
        {/* Sub-Header / Strategy Presets Banner on Mobile */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Scenario Presets:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {PRESET_DEALS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.inputs)}
                className="px-2 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 whitespace-nowrap"
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Viability Alert (Top prominent position) */}
        <ViabilityAlert results={results} />

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Inputs (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <DealForm
              inputs={inputs}
              onChange={setInputs}
              onGeneratePitch={scrollToPitch}
            />
          </div>

          {/* Right Column: Financial Analytics, KPIs & Waterfall (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <MetricsCards results={results} />
            <CashFlowWaterfall inputs={inputs} results={results} />
          </div>
        </div>

        {/* Full-Width Pitch Generator Section */}
        <div className="pt-2">
          <PitchGeneratorPanel inputs={inputs} results={results} />
        </div>

        {/* Trust & Compliance Notice */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Baruch-Ermi LLC Standard:</strong> All Subject-To and Seller Financing acquisitions are executed via licensed Title &amp; Escrow companies with national third-party loan servicing platforms.
            </span>
          </div>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            View Strategy Guide
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-xs text-slate-500 text-center no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Baruch-Ermi LLC. All rights reserved.</p>
          <p className="text-slate-600">
            Confidential Real Estate Underwriting &amp; Creative Offer Generator
          </p>
        </div>
      </footer>

      {/* Educational & Strategy Guide Modal */}
      <StrategyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
