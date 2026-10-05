import React from 'react';
import { X, BookOpen, CheckCircle, ShieldAlert, DollarSign, HelpCircle, Layers } from 'lucide-react';

interface StrategyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StrategyGuideModal: React.FC<StrategyGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              Creative Financing Deal Structuring &amp; Pitch Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* 1. Subject-To vs Seller Financing */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" /> 1. Subject-To vs. Seller Financing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                  Subject-To (Existing Mortgage)
                </h4>
                <p className="text-xs text-slate-300">
                  You purchase the property subject to the seller&apos;s existing financing staying in place. The deed transfers to your entity, and you take over the monthly mortgage payments directly through a third-party loan servicing company.
                </p>
                <div className="mt-2 text-[11px] text-slate-400">
                  <strong>Best for:</strong> Properties with attractive low interest rates (e.g. 2.75%–4.5%) where the seller needs quick debt relief or lacks sufficient equity to pay cash closing costs.
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  Seller Financing
                </h4>
                <p className="text-xs text-slate-300">
                  The seller owns the property free &amp; clear (or has massive equity) and agrees to act as the lender. You sign a Promissory Note and Deed of Trust / Mortgage specifying interest rate, balloon timeline, and monthly payments.
                </p>
                <div className="mt-2 text-[11px] text-slate-400">
                  <strong>Best for:</strong> Retiring landlords, inherited properties, or sellers desiring steady monthly income without landlord maintenance headaches.
                </div>
              </div>
            </div>
          </div>

          {/* 2. Total Entry Fee Explained */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> 2. Total Entry Fee Formula
            </h3>
            <p className="text-xs text-slate-300">
              The entry fee is the actual liquid capital you need to bring to the closing table.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400">
              Total Entry Fee = Proposed Down Payment + 3% Closing Costs (Title &amp; Escrow) + Estimated Rehab
            </div>
            <p className="text-xs text-slate-400">
              Listing agents and sellers will evaluate your proof of funds based on this entry fee number.
            </p>
          </div>

          {/* 3. The 20% OpEx Reserve & Viability */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> 3. Why 20% OpEx Reserve?
            </h3>
            <p className="text-xs text-slate-300">
              Novice investors often underestimate vacancy, property management, property taxes, insurance rate increases, and maintenance CapEx. Reserving 20% of gross market rent ensures your projected cash flow is realistic and resilient.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300 pl-2">
              <div>• <strong className="text-emerald-400">Green Alert (&gt; $300/mo):</strong> Solid buffer. The deal handles market fluctuations with positive margin.</div>
              <div>• <strong className="text-amber-400">Yellow Alert ($0–$300/mo):</strong> Marginal buffer. Consider negotiating a lower interest rate, longer amortization, or small discount on down payment.</div>
              <div>• <strong className="text-rose-400">Red Alert (&lt; $0):</strong> Negative cash flow. Restructure required prior to submitting.</div>
            </div>
          </div>

          {/* 4. Overcoming Agent Hesitation */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" /> 4. Overcoming Listing Agent Objections
            </h3>
            <p className="text-xs text-slate-300">
              Real estate agents care about two primary questions:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-300">
              <li><strong className="text-white">Will I get paid my full commission?</strong> Yes. In creative financing offers, buyer entry fees explicitly fund the listing and buyer broker commissions in full through escrow.</li>
              <li><strong className="text-white">Will this actually close?</strong> Yes. Because there is no commercial loan underwriting or retail appraisal delay, creative deals close cleanly and predictably.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Got It, Back to Generator
          </button>
        </div>
      </div>
    </div>
  );
};
