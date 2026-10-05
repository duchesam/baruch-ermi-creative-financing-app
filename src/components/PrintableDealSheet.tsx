import React from 'react';
import { DealInputs, DealCalculationResults } from '../types/deal';
import { formatCurrency, formatPercent } from '../utils/calculator';

interface PrintableDealSheetProps {
  inputs: DealInputs;
  results: DealCalculationResults;
}

export const PrintableDealSheet: React.FC<PrintableDealSheetProps> = ({
  inputs,
  results,
}) => {
  return (
    <div className="hidden print:block print-only p-8 text-slate-900 bg-white font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            Baruch-Ermi LLC
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            Real Estate Acquisitions &amp; Creative Financing Division
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Email: {inputs.buyerEmail || 'acquisitions@baruch-ermi.com'} | Phone: {inputs.buyerPhone || '(555) 019-2831'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Official Deal Term Sheet
          </div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="inline-block mt-2 px-2.5 py-1 text-xs font-bold uppercase border border-slate-900 rounded">
            {inputs.dealStructure}
          </div>
        </div>
      </div>

      {/* Target Property */}
      <div className="bg-slate-100 p-4 rounded-lg mb-6 border border-slate-300">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Target Property Address
        </div>
        <div className="text-lg font-bold text-slate-900 mt-0.5">
          {inputs.propertyAddress || 'Address Not Specified'}
        </div>
      </div>

      {/* Executive Financial Table */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Deal Structure */}
        <div className="border border-slate-300 rounded-lg p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 mb-3">
            Acquisition &amp; Capital Structure
          </h2>
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-100 py-1">
                <td className="text-slate-600 py-1.5">Purchase Price:</td>
                <td className="font-bold text-slate-900 text-right font-mono">
                  {formatCurrency(results.purchasePrice)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 py-1">
                <td className="text-slate-600 py-1.5">Estimated ARV:</td>
                <td className="font-bold text-slate-900 text-right font-mono">
                  {formatCurrency(results.estimatedARV)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 py-1">
                <td className="text-slate-600 py-1.5">Proposed Down Payment:</td>
                <td className="font-bold text-slate-900 text-right font-mono">
                  {formatCurrency(results.downPayment)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 py-1">
                <td className="text-slate-600 py-1.5">
                  {inputs.dealStructure.includes('Subject-To') ? 'Underlying Mortgage:' : 'Seller Carry Loan:'}
                </td>
                <td className="font-bold text-slate-900 text-right font-mono">
                  {formatCurrency(results.loanBalance)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 py-1">
                <td className="text-slate-600 py-1.5">Monthly Debt Payment:</td>
                <td className="font-bold text-slate-900 text-right font-mono">
                  {formatCurrency(results.monthlyPayment)}/mo
                </td>
              </tr>
              <tr>
                <td className="text-slate-600 py-1.5">Agreed Terms:</td>
                <td className="font-semibold text-slate-900 text-right text-[11px]">
                  {inputs.proposedTerms || 'As agreed'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Operating & Cash Flow */}
        <div className="border border-slate-300 rounded-lg p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5 mb-3">
            Operating Performance &amp; Cash Flow
          </h2>
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="text-slate-600 py-1.5">Monthly Market Rent:</td>
                <td className="font-bold text-slate-900 text-right font-mono">
                  {formatCurrency(results.monthlyRent)}/mo
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="text-slate-600 py-1.5">20% OpEx Reserves:</td>
                <td className="font-semibold text-slate-700 text-right font-mono">
                  -{formatCurrency(results.operatingExpenses)}/mo
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="text-slate-600 py-1.5">Monthly Debt Service:</td>
                <td className="font-semibold text-slate-700 text-right font-mono">
                  -{formatCurrency(results.monthlyPayment)}/mo
                </td>
              </tr>
              <tr className="border-b-2 border-slate-300 bg-slate-50">
                <td className="font-bold text-slate-900 py-1.5">Net Monthly Cash Flow:</td>
                <td className="font-bold text-slate-900 text-right font-mono">
                  {formatCurrency(results.monthlyCashFlow)}/mo
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="text-slate-600 py-1.5">Annual Cash Flow:</td>
                <td className="font-bold text-slate-900 text-right font-mono">
                  {formatCurrency(results.annualCashFlow)}/yr
                </td>
              </tr>
              <tr>
                <td className="text-slate-600 py-1.5">Cash-on-Cash Return:</td>
                <td className="font-bold text-slate-900 text-right font-mono">
                  {results.cashOnCashReturn.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Capital Summary */}
      <div className="border border-slate-300 rounded-lg p-4 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Total Entry Fee Required at Closing
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase">Down Payment</div>
            <div className="text-sm font-bold font-mono text-slate-900">
              {formatCurrency(results.downPayment)}
            </div>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase">3% Closing / Title</div>
            <div className="text-sm font-bold font-mono text-slate-900">
              {formatCurrency(results.closingCosts)}
            </div>
          </div>
          <div className="p-2 bg-slate-100 rounded border border-slate-300">
            <div className="text-[10px] font-bold text-slate-700 uppercase">Total Capital</div>
            <div className="text-sm font-black font-mono text-slate-900">
              {formatCurrency(results.totalEntryFee)}
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Closing Conditions */}
      <div className="text-xs text-slate-600 space-y-1 mb-8">
        <p>• <strong>Condition:</strong> Purchased 100% As-Is, with zero repair concessions requested.</p>
        <p>• <strong>Inspection:</strong> {inputs.inspectionPeriodDays || 7} calendar days informational inspection period.</p>
        <p>• <strong>Closing:</strong> Within {inputs.closingDays || 21} business days through a licensed Title &amp; Escrow company.</p>
        <p>• <strong>Loan Servicing:</strong> Managed through a licensed national third-party servicing platform.</p>
      </div>

      {/* Signature Section */}
      <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs">
        <div>
          <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-900">
            {inputs.buyerEntity || 'Baruch-Ermi LLC'}
          </div>
          <div className="text-slate-500">Authorized Buyer Signature &amp; Date</div>
        </div>
        <div>
          <div className="border-b border-slate-400 pb-1 mb-1">&nbsp;</div>
          <div className="text-slate-500">Property Owner / Seller Acceptance &amp; Date</div>
        </div>
      </div>
    </div>
  );
};
