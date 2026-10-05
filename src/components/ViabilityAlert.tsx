import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, TrendingUp, DollarSign } from 'lucide-react';
import { DealCalculationResults } from '../types/deal';
import { formatCurrency } from '../utils/calculator';

interface ViabilityAlertProps {
  results: DealCalculationResults;
}

export const ViabilityAlert: React.FC<ViabilityAlertProps> = ({ results }) => {
  const { viability, monthlyCashFlow, cashOnCashReturn } = results;

  const renderIcon = () => {
    switch (viability.level) {
      case 'strong':
        return <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />;
      case 'moderate':
        return <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />;
      case 'negative':
        return <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />;
    }
  };

  const getBadgeStyle = () => {
    switch (viability.level) {
      case 'strong':
        return {
          pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          container: 'bg-emerald-950/30 border-emerald-800/50',
          dot: 'bg-emerald-400',
        };
      case 'moderate':
        return {
          pill: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          container: 'bg-amber-950/30 border-amber-800/50',
          dot: 'bg-amber-400',
        };
      case 'negative':
        return {
          pill: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          container: 'bg-rose-950/30 border-rose-800/50',
          dot: 'bg-rose-400',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-all duration-300 ${style.container}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Heading & Explanation */}
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5">{renderIcon()}</div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Deal Viability Alert
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${style.pill}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${style.dot}`} />
                {viability.level === 'strong' && 'Green: High Viability (> $300/mo)'}
                {viability.level === 'moderate' && 'Yellow: Moderate Viability ($0–$300/mo)'}
                {viability.level === 'negative' && 'Red: Negative Cash Flow Alert (< $0)'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mt-1">
              {viability.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              {viability.description}
            </p>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6 shrink-0">
          <div>
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" />
              Net Monthly
            </div>
            <div
              className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                monthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {monthlyCashFlow >= 0 ? '+' : ''}
              {formatCurrency(monthlyCashFlow)}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-slate-400" />
              Cash-on-Cash
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-100">
              {cashOnCashReturn.toFixed(1)}%
              <span className="text-xs font-normal text-slate-400">/yr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
