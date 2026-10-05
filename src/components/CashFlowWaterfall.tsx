import React from 'react';
import { DollarSign, Shield, Home, Briefcase, ArrowRight } from 'lucide-react';
import { DealCalculationResults, DealInputs } from '../types/deal';
import { formatCurrency } from '../utils/calculator';

interface CashFlowWaterfallProps {
  inputs: DealInputs;
  results: DealCalculationResults;
}

export const CashFlowWaterfall: React.FC<CashFlowWaterfallProps> = ({
  inputs,
  results,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Financial Breakdown &amp; Cash Flow Waterfall
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent breakdown of operating reserves, debt service, and net returns.
          </p>
        </div>
        <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 tabular-nums">
          Rule: 20% OpEx Reserve
        </span>
      </div>

      {/* Waterfall steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Cash Flow Waterfall */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-blue-400" /> Monthly Revenue &amp; Expense Steps
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-3">
            {/* Step 1: Gross Market Rent */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Gross Monthly Market Rent
              </span>
              <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                +{formatCurrency(results.monthlyRent)}
              </span>
            </div>

            {/* Step 2: 20% Reserve */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 pl-3.5">
                <span>Taxes, Insurance &amp; Maintenance (20%)</span>
              </span>
              <span className="font-mono text-amber-400 font-medium tabular-nums">
                -{formatCurrency(results.operatingExpenses)}
              </span>
            </div>

            <div className="border-t border-slate-800/70 pt-2 flex items-center justify-between text-xs text-slate-300">
              <span className="pl-3.5 font-medium">Net Operating Income (NOI):</span>
              <span className="font-mono font-semibold text-slate-200 tabular-nums">
                {formatCurrency(results.netOperatingIncome)}
              </span>
            </div>

            {/* Step 3: Debt service */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 pl-3.5">
                <span>
                  {inputs.dealStructure === 'Subject-To (Existing Mortgage)'
                    ? 'Sub-To P&I Mortgage Payment'
                    : 'Seller Financing Monthly Note'}
                </span>
              </span>
              <span className="font-mono text-rose-400 font-medium tabular-nums">
                -{formatCurrency(results.monthlyPayment)}
              </span>
            </div>

            {/* Final Net Cash Flow */}
            <div className="border-t-2 border-slate-800 pt-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    results.monthlyCashFlow >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                Estimated Net Cash Flow
              </span>
              <span
                className={`font-mono text-base font-bold tabular-nums ${
                  results.monthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {results.monthlyCashFlow >= 0 ? '+' : ''}
                {formatCurrency(results.monthlyCashFlow)}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </span>
            </div>
          </div>
        </div>

        {/* Total Entry Fee Composition */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Capital Requirements (Total Entry Fee)
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Proposed Seller Down Payment</span>
              <span className="font-mono text-slate-100 font-semibold tabular-nums">
                {formatCurrency(results.downPayment)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Estimated Closing Costs ({inputs.closingCostPercent}% standard title/escrow)
              </span>
              <span className="font-mono text-slate-300 tabular-nums">
                {formatCurrency(results.closingCosts)}
              </span>
            </div>

            {results.rehabCosts > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Property Rehab / Make-Ready</span>
                <span className="font-mono text-slate-300 tabular-nums">
                  {formatCurrency(results.rehabCosts)}
                </span>
              </div>
            )}

            <div className="border-t-2 border-slate-800 pt-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Total Cash Required to Close
              </span>
              <span className="font-mono text-base font-bold text-blue-400 tabular-nums">
                {formatCurrency(results.totalEntryFee)}
              </span>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 leading-tight">
              <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                Entry fee is paid at closing through title/escrow to protect both buyer and seller.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
