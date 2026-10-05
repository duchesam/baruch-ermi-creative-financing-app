export type DealStructure = 'Subject-To (Existing Mortgage)' | 'Seller Financing';

export interface DealInputs {
  propertyAddress: string;
  purchasePrice: number;
  estimatedARV: number;
  dealStructure: DealStructure;
  existingMortgageBalance: number;
  monthlyPayment: number;
  proposedDownPayment: number;
  proposedTerms: string;
  monthlyMarketRent: number;
  
  // Advanced optional adjustments with sensible defaults
  estimatedRehab: number;
  closingCostPercent: number; // default 3%
  buyerEntity: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  closingDays: number; // e.g. 14, 21, 30 days
  inspectionPeriodDays: number; // e.g. 7-10 days
}

export type ViabilityLevel = 'strong' | 'moderate' | 'negative';

export interface DealCalculationResults {
  purchasePrice: number;
  estimatedARV: number;
  downPayment: number;
  loanBalance: number;
  closingCosts: number;
  rehabCosts: number;
  totalEntryFee: number;
  monthlyRent: number;
  monthlyPayment: number;
  operatingExpenses: number; // 20% of monthly rent (taxes, insurance, maintenance)
  netOperatingIncome: number; // rent - operatingExpenses
  monthlyCashFlow: number; // rent - payment - operatingExpenses
  annualCashFlow: number;
  cashOnCashReturn: number; // (annualCashFlow / totalEntryFee) * 100
  loanToValueOnPrice: number; // (loanBalance / purchasePrice) * 100
  loanToValueOnARV: number; // (loanBalance / estimatedARV) * 100
  instantEquity: number; // estimatedARV - purchasePrice
  sellerNetEquityBalance: number; // purchasePrice - loanBalance
  viability: {
    level: ViabilityLevel;
    title: string;
    description: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    accentClass: string;
  };
}

export type PitchAudience = 'agent' | 'seller' | 'loi' | 'executive';

export interface PresetDeal {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: DealInputs;
}
