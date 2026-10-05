import React, { useState } from 'react';
import {
  MapPin,
  DollarSign,
  Layers,
  FileText,
  Sliders,
  Sparkles,
  HelpCircle,
  Building,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { DealInputs, DealStructure } from '../types/deal';

const RENTCAST_API_KEY = 'ae16b2b43f0c4c80a8ce7ad17ea15d3a';

interface DealFormProps {
  inputs: DealInputs;
  onChange: (inputs: DealInputs) => void;
  onGeneratePitch: () => void;
  onToast?: (message: string, isError?: boolean) => void;
}

export const DealForm: React.FC<DealFormProps> = ({
  inputs,
  onChange,
  onGeneratePitch,
  onToast,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [apiDetailMsg, setApiDetailMsg] = useState<string | null>(null);

  const handleInputChange = (field: keyof DealInputs, value: string | number) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  const handleNumericChange = (field: keyof DealInputs, rawValue: string) => {
    const cleanValue = rawValue.replace(/[^0-9.]/g, '');
    const numValue = cleanValue === '' ? 0 : parseFloat(cleanValue);
    handleInputChange(field, isNaN(numValue) ? 0 : numValue);
  };

  const setDownPaymentPercent = (pct: number) => {
    const calculated = Math.round((inputs.purchasePrice * pct) / 100);
    handleInputChange('proposedDownPayment', calculated);
  };

  const handleFetchPropertyData = async () => {
    const address = inputs.propertyAddress.trim();
    if (!address) {
      const errorMsg = 'Address details not found. Please enter deal metrics manually.';
      setFetchError(errorMsg);
      onToast?.(errorMsg, true);
      return;
    }

    setIsFetching(true);
    setFetchError(null);
    setApiDetailMsg(null);

    try {
      const encodedAddress = encodeURIComponent(address);
      const headers = {
        'X-Api-Key': RENTCAST_API_KEY,
        'accept': 'application/json',
      };

      // 1. Rent Valuation endpoint
      const rentUrl = `https://api.rentcast.io/v1/avm/rent/long-term?address=${encodedAddress}`;
      // 2. Property Valuation (AVM) endpoint
      const valUrl = `https://api.rentcast.io/v1/avm/value?address=${encodedAddress}`;

      const [rentResponse, valResponse] = await Promise.all([
        fetch(rentUrl, { headers }).catch((e) => {
          console.warn('Rentcast rent fetch error:', e);
          return null;
        }),
        fetch(valUrl, { headers }).catch((e) => {
          console.warn('Rentcast valuation fetch error:', e);
          return null;
        }),
      ]);

      let rentEstimate: number | null = null;
      let arvEstimate: number | null = null;
      let errorDetail: string | null = null;

      if (rentResponse && rentResponse.ok) {
        const rentData = await rentResponse.json();
        if (typeof rentData.rent === 'number') {
          rentEstimate = rentData.rent;
        } else if (typeof rentData.price === 'number') {
          rentEstimate = rentData.price;
        } else if (typeof rentData.rentRangeHigh === 'number') {
          rentEstimate = rentData.rentRangeHigh;
        }
      } else if (rentResponse && !rentResponse.ok) {
        try {
          const errData = await rentResponse.json();
          if (errData?.message) errorDetail = errData.message;
        } catch {
          // ignore parsing error
        }
      }

      if (valResponse && valResponse.ok) {
        const valData = await valResponse.json();
        if (typeof valData.price === 'number') {
          arvEstimate = valData.price;
        } else if (typeof valData.priceRangeHigh === 'number') {
          arvEstimate = valData.priceRangeHigh;
        } else if (typeof valData.priceRangeLow === 'number') {
          arvEstimate = valData.priceRangeLow;
        }
      } else if (valResponse && !valResponse.ok) {
        try {
          const errData = await valResponse.json();
          if (errData?.message) errorDetail = errData.message;
        } catch {
          // ignore parsing error
        }
      }

      // Check if we successfully got any metrics
      if (rentEstimate !== null || arvEstimate !== null) {
        const updated = { ...inputs };
        if (rentEstimate !== null) {
          updated.monthlyMarketRent = Math.round(rentEstimate);
        }
        if (arvEstimate !== null) {
          updated.estimatedARV = Math.round(arvEstimate);
        }
        onChange(updated);
        onToast?.('Property data loaded successfully!', false);
      } else {
        const mainError = 'Address details not found. Please enter deal metrics manually.';
        setFetchError(mainError);
        if (errorDetail) {
          setApiDetailMsg(`RentCast API note: ${errorDetail}`);
        }
        onToast?.(mainError, true);
      }
    } catch (err) {
      console.error('Fetch property data failed:', err);
      const mainError = 'Address details not found. Please enter deal metrics manually.';
      setFetchError(mainError);
      onToast?.(mainError, true);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Deal Parameters &amp; Financial Terms
          </h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          9 Core Fields Required
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Property Address */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> 1. Property Address
            </span>
            <span className="text-[11px] text-blue-400 font-normal">
              Auto-fetch Rent &amp; AVM
            </span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputs.propertyAddress}
                onChange={(e) => {
                  handleInputChange('propertyAddress', e.target.value);
                  if (fetchError) setFetchError(null);
                }}
                placeholder="e.g. 742 Evergreen Terrace, Springfield, OR 97477"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleFetchPropertyData}
              disabled={isFetching || !inputs.propertyAddress.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-800 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg border border-blue-500/40 shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer whitespace-nowrap"
              title="Fetch RentCast AVM property valuation & long-term rent estimate"
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
                  <span>Fetching Property Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Fetch Property Data</span>
                </>
              )}
            </button>
          </div>

          {/* Alert message when address not found or API call fails */}
          {fetchError && (
            <div className="mt-2.5 p-3 rounded-lg bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-100">{fetchError}</p>
                {apiDetailMsg && (
                  <p className="text-[11px] text-rose-300/80 mt-0.5">{apiDetailMsg}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setFetchError(null)}
                className="text-rose-400 hover:text-rose-200 text-[11px] font-semibold underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-1">
            Click &quot;Fetch Property Data&quot; to auto-populate RentCast market rent (field #9) and estimated ARV (field #3).
          </p>
        </div>

        {/* 2 & 3. Purchase Price & Estimated ARV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Purchase Price */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-400" /> 2. Purchase Price
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Contract Price</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-mono">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.purchasePrice || ''}
                onChange={(e) => handleNumericChange('purchasePrice', e.target.value)}
                placeholder="350000"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tabular-nums"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Agreed or proposed total acquisition purchase price.
            </p>
          </div>

          {/* Estimated ARV */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" /> 3. Estimated ARV
              </span>
              <span className="text-[11px] text-blue-400 font-normal">Auto-populated by AVM</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-mono">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.estimatedARV || ''}
                onChange={(e) => handleNumericChange('estimatedARV', e.target.value)}
                placeholder="385000"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tabular-nums"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Appraised or retail market value in fully renovated condition.
            </p>
          </div>
        </div>

        {/* 4. Deal Structure Dropdown */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> 4. Deal Structure
            </span>
            <span className="text-[11px] text-blue-400 font-medium">Acquisition Model</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => handleInputChange('dealStructure', 'Subject-To (Existing Mortgage)')}
              className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 cursor-pointer ${
                inputs.dealStructure === 'Subject-To (Existing Mortgage)'
                  ? 'bg-blue-950/60 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="mt-0.5">
                <CheckCircle
                  className={`w-4 h-4 ${
                    inputs.dealStructure === 'Subject-To (Existing Mortgage)'
                      ? 'text-blue-400'
                      : 'text-slate-600'
                  }`}
                />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">
                  Subject-To (Existing Mortgage)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Keep seller&apos;s low-rate financing in place; buyer takes over monthly debt service.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleInputChange('dealStructure', 'Seller Financing')}
              className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 cursor-pointer ${
                inputs.dealStructure === 'Seller Financing'
                  ? 'bg-blue-950/60 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="mt-0.5">
                <CheckCircle
                  className={`w-4 h-4 ${
                    inputs.dealStructure === 'Seller Financing'
                      ? 'text-blue-400'
                      : 'text-slate-600'
                  }`}
                />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">
                  Seller Financing
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Seller acts as the bank, holding a promissory note with customized terms &amp; interest.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 5 & 6. Debt Balance & Monthly Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mortgage Balance / Seller Loan Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-400" /> 5. Mortgage / Loan Amount
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Principal</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-mono">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.existingMortgageBalance || ''}
                onChange={(e) =>
                  handleNumericChange('existingMortgageBalance', e.target.value)
                }
                placeholder="280000"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tabular-nums"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {inputs.dealStructure === 'Subject-To (Existing Mortgage)'
                ? 'Current principal balance of existing mortgage to be taken over.'
                : 'Principal amount carried by the seller on the promissory note.'}
            </p>
          </div>

          {/* Monthly P&I or Seller Payment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" /> 6. Monthly Debt Payment
              </span>
              <span className="text-[11px] text-slate-400 font-normal">P&amp;I / Note Payment</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-mono">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.monthlyPayment || ''}
                onChange={(e) => handleNumericChange('monthlyPayment', e.target.value)}
                placeholder="1350"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tabular-nums"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Monthly Principal &amp; Interest to lender or seller carryback note payment.
            </p>
          </div>
        </div>

        {/* 7 & 8. Proposed Down Payment & Proposed Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proposed Down Payment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-400" /> 7. Proposed Down Payment
              </label>
              {/* Quick % buttons */}
              {inputs.purchasePrice > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDownPaymentPercent(5)}
                    className="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                  >
                    5%
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownPaymentPercent(10)}
                    className="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                  >
                    10%
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownPaymentPercent(15)}
                    className="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                  >
                    15%
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-mono">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.proposedDownPayment || ''}
                onChange={(e) =>
                  handleNumericChange('proposedDownPayment', e.target.value)
                }
                placeholder="25000"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tabular-nums"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Cash equity paid to seller or listing agent at close of escrow.
            </p>
          </div>

          {/* Proposed Terms */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> 8. Proposed Terms &amp; Rate
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Structure</span>
            </label>
            <input
              type="text"
              value={inputs.proposedTerms}
              onChange={(e) => handleInputChange('proposedTerms', e.target.value)}
              placeholder="e.g. 3.5% Interest-Only, 5-Year Balloon, No Prepayment Penalty"
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Interest rate, amortization duration, balloon period, or servicing notes.
            </p>
          </div>
        </div>

        {/* 9. Estimated Monthly Market Rent */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-400" /> 9. Estimated Monthly Market Rent
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">Auto-populated by RentCast</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-mono">
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={inputs.monthlyMarketRent || ''}
              onChange={(e) =>
                handleNumericChange('monthlyMarketRent', e.target.value)
              }
              placeholder="2400"
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tabular-nums"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Conservative long-term market rent (calculator reserves 20% for taxes, insurance, &amp; maintenance).
          </p>
        </div>

        {/* Advanced Settings Accordion */}
        <div className="border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-slate-200 py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              {showAdvanced ? 'Hide Advanced Deal Modifiers' : 'Customize Closing Costs, Entity & Closing Timelines'}
            </span>
            <span className="text-blue-400 font-semibold">
              {showAdvanced ? 'Collapse ▲' : 'Expand ▼'}
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Closing Cost % (Default 3%)
                  </label>
                  <input
                    type="number"
                    value={inputs.closingCostPercent}
                    onChange={(e) =>
                      handleInputChange('closingCostPercent', parseFloat(e.target.value) || 0)
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-100 tabular-nums"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Standard 3% covers title search, insurance, legal &amp; escrow fees.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Estimated Rehab / Repairs ($)
                  </label>
                  <input
                    type="text"
                    value={inputs.estimatedRehab || ''}
                    onChange={(e) => handleNumericChange('estimatedRehab', e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-100 tabular-nums"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Cosmetic or deferred maintenance required to achieve target rent.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Purchasing Entity
                  </label>
                  <input
                    type="text"
                    value={inputs.buyerEntity}
                    onChange={(e) => handleInputChange('buyerEntity', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Target Close (Days)
                  </label>
                  <input
                    type="number"
                    value={inputs.closingDays}
                    onChange={(e) =>
                      handleInputChange('closingDays', parseInt(e.target.value) || 21)
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Inspection Period (Days)
                  </label>
                  <input
                    type="number"
                    value={inputs.inspectionPeriodDays}
                    onChange={(e) =>
                      handleInputChange('inspectionPeriodDays', parseInt(e.target.value) || 7)
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 tabular-nums"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate Pitch Script CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onGeneratePitch}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] border border-blue-400/30 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-blue-200" />
            <span className="text-base tracking-wide">Generate Pitch Script &amp; Offer</span>
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            Generates polished email pitches for listing agents, direct sellers, and legal LOI format.
          </p>
        </div>
      </div>
    </div>
  );
};

