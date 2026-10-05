import React from 'react';
import {
  Wallet,
  TrendingUp,
  Percent,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  PieChart,
} from 'lucide-react';
import { DealCalculationResults } from '../types/deal';
import { formatCurrency, formatPercent } from '../utils/calculator';

interface MetricsCardsProps {
  results: DealCalculationResults;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ results }) => {
  return (
    <div className="space-y-4">
      {/* Primary KPI Row: Total Entry Fee & Estimated Monthly Cash Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Entry Fee */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-blue-400" /> Total Entry Fee
            </span>
            <span className="text-[10px] text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/60">
              Capital Required
            </span>
          </div>

          <div className="text-3xl font-extrabold font-mono tabular-nums text-white mt-1">
            {formatCurrency(results.totalEntryFee)}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Proposed Down Payment:</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {formatCurrency(results.downPayment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Closing Costs (3%):</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {formatCurrency(results.closingCosts)}
              </span>
            </div>
            {results.rehabCosts > 0 && (
              <div className="flex justify-between">
                <span>Estimated Rehab / Repairs:</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {formatCurrency(results.rehabCosts)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Estimated Monthly Cash Flow */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Est. Monthly Cash Flow
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                results.monthlyCashFlow > 300
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                  : results.monthlyCashFlow >= 0
                  ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                  : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
              }`}
            >
              {results.monthlyCashFlow > 300
                ? '> $300 Goal'
                : results.monthlyCashFlow >= 0
                ? 'Marginal'
                : 'Deficit'}
            </span>
          </div>

          <div
            className={`text-3xl font-extrabold font-mono tabular-nums mt-1 ${
              results.monthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {results.monthlyCashFlow >= 0 ? '+' : ''}
            {formatCurrency(results.monthlyCashFlow)}
            <span className="text-xs text-slate-400 font-normal"> /mo</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Gross Market Rent:</span>
              <span className="font-mono text-emerald-400 tabular-nums">
                +{formatCurrency(results.monthlyRent)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>20% OpEx (Taxes, Ins, Maint):</span>
              <span className="font-mono text-amber-400/90 tabular-nums">
                -{formatCurrency(results.operatingExpenses)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Debt Service:</span>
              <span className="font-mono text-rose-400/90 tabular-nums">
                -{formatCurrency(results.monthlyPayment)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Cash-on-Cash Return */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Percent className="w-3 h-3 text-blue-400" /> Cash on Cash
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {results.cashOnCashReturn.toFixed(1)}%
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {formatCurrency(results.annualCashFlow)}/yr net
          </p>
        </div>

        {/* Instant Equity */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-indigo-400" /> Instant Equity
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {formatCurrency(results.instantEquity)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">ARV vs. Purchase</p>
        </div>

        {/* Loan-To-Value */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" /> LTV on Price
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {results.loanToValueOnPrice.toFixed(1)}%
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {results.loanToValueOnARV.toFixed(1)}% on ARV
          </p>
        </div>

        {/* Net Operating Income (NOI) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Monthly NOI
          </div>
          <div className="text-lg font-bold font-mono text-slate-100 mt-1 tabular-nums">
            {formatCurrency(results.netOperatingIncome)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Before debt payment</p>
        </div>
      </div>
    </div>
  );
};
