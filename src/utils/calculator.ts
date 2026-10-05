import { DealInputs, DealCalculationResults, ViabilityLevel } from '../types/deal';

export function calculateDeal(inputs: DealInputs): DealCalculationResults {
  const purchasePrice = Math.max(0, Number(inputs.purchasePrice) || 0);
  const estimatedARV = Math.max(0, Number(inputs.estimatedARV) || 0);
  const downPayment = Math.max(0, Number(inputs.proposedDownPayment) || 0);
  const loanBalance = Math.max(0, Number(inputs.existingMortgageBalance) || 0);
  const monthlyPayment = Math.max(0, Number(inputs.monthlyPayment) || 0);
  const monthlyRent = Math.max(0, Number(inputs.monthlyMarketRent) || 0);
  const rehabCosts = Math.max(0, Number(inputs.estimatedRehab) || 0);
  
  // Closing costs: default 3% of purchase price (or user customized %)
  const closingCostPercent = inputs.closingCostPercent !== undefined ? Number(inputs.closingCostPercent) : 3;
  const closingCosts = Math.round((purchasePrice * closingCostPercent) / 100);
  
  // Total Entry Fee = Proposed Down Payment + Estimated Closing/Rehab Costs (assume 3% closing costs)
  const totalEntryFee = downPayment + closingCosts + rehabCosts;
  
  // 20% for taxes, insurance, and maintenance
  const operatingExpenses = Math.round(monthlyRent * 0.20);
  
  // Net Operating Income before debt service
  const netOperatingIncome = monthlyRent - operatingExpenses;
  
  // Estimated Monthly Cash Flow = Monthly Market Rent - Monthly Payment - (20% for taxes, insurance, and maintenance)
  const monthlyCashFlow = Math.round(monthlyRent - monthlyPayment - operatingExpenses);
  const annualCashFlow = monthlyCashFlow * 12;
  
  // Cash-on-Cash return: annualCashFlow / totalEntryFee * 100
  const cashOnCashReturn = totalEntryFee > 0 ? (annualCashFlow / totalEntryFee) * 100 : 0;
  
  // LTV ratios
  const loanToValueOnPrice = purchasePrice > 0 ? (loanBalance / purchasePrice) * 100 : 0;
  const loanToValueOnARV = estimatedARV > 0 ? (loanBalance / estimatedARV) * 100 : 0;
  const instantEquity = estimatedARV - purchasePrice;
  const sellerNetEquityBalance = Math.max(0, purchasePrice - loanBalance);

  // Viability Level:
  // Green badge if Cash Flow > $300/mo
  // Yellow if $0-$300/mo
  // Red if Negative
  let viabilityLevel: ViabilityLevel;
  let viabilityTitle: string;
  let viabilityDescription: string;
  let colorClass: string;
  let bgClass: string;
  let borderClass: string;
  let accentClass: string;

  if (monthlyCashFlow > 300) {
    viabilityLevel = 'strong';
    viabilityTitle = 'High Deal Viability';
    viabilityDescription = `Cash flow of ${formatCurrency(monthlyCashFlow)}/mo exceeds the $300 benchmark with healthy 20% OpEx reserves.`;
    colorClass = 'text-emerald-400';
    bgClass = 'bg-emerald-950/40';
    borderClass = 'border-emerald-600/60';
    accentClass = 'bg-emerald-500';
  } else if (monthlyCashFlow >= 0) {
    viabilityLevel = 'moderate';
    viabilityTitle = 'Moderate Viability - Tight Margins';
    viabilityDescription = `Cash flow of ${formatCurrency(monthlyCashFlow)}/mo is positive ($0–$300/mo), but requires close monitoring of reserves or terms restructuring.`;
    colorClass = 'text-amber-400';
    bgClass = 'bg-amber-950/40';
    borderClass = 'border-amber-600/60';
    accentClass = 'bg-amber-500';
  } else {
    viabilityLevel = 'negative';
    viabilityTitle = 'Risk Alert - Negative Cash Flow';
    viabilityDescription = `Projected monthly deficit of -${formatCurrency(Math.abs(monthlyCashFlow))}/mo. Consider lowering the down payment, negotiating lower interest/payment terms, or raising rent projections.`;
    colorClass = 'text-rose-400';
    bgClass = 'bg-rose-950/40';
    borderClass = 'border-rose-600/60';
    accentClass = 'bg-rose-500';
  }

  return {
    purchasePrice,
    estimatedARV,
    downPayment,
    loanBalance,
    closingCosts,
    rehabCosts,
    totalEntryFee,
    monthlyRent,
    monthlyPayment,
    operatingExpenses,
    netOperatingIncome,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn,
    loanToValueOnPrice,
    loanToValueOnARV,
    instantEquity,
    sellerNetEquityBalance,
    viability: {
      level: viabilityLevel,
      title: viabilityTitle,
      description: viabilityDescription,
      colorClass,
      bgClass,
      borderClass,
      accentClass,
    }
  };
}

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0.0%';
  return `${value.toFixed(decimals)}%`;
}
