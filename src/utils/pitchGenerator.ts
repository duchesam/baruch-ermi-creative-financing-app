import { DealInputs, DealCalculationResults, PitchAudience } from '../types/deal';
import { formatCurrency } from './calculator';

export function generatePitchScript(
  inputs: DealInputs,
  results: DealCalculationResults,
  audience: PitchAudience = 'agent'
): { subject: string; body: string } {
  const property = inputs.propertyAddress.trim() || '[Property Address]';
  const price = formatCurrency(results.purchasePrice);
  const downPayment = formatCurrency(results.downPayment);
  const loanBalance = formatCurrency(results.loanBalance);
  const monthlyPayment = formatCurrency(results.monthlyPayment);
  const terms = inputs.proposedTerms.trim() || 'Specified mutually agreed terms';
  const buyerEntity = inputs.buyerEntity.trim() || 'Baruch-Ermi LLC';
  const buyerName = inputs.buyerName.trim() || 'Acquisitions Team';
  const buyerPhone = inputs.buyerPhone.trim() || '(555) 019-2831';
  const buyerEmail = inputs.buyerEmail.trim() || 'acquisitions@baruch-ermi.com';
  const closingDays = inputs.closingDays || 21;
  const inspectionDays = inputs.inspectionPeriodDays || 7;
  const isSubTo = inputs.dealStructure.includes('Subject-To');

  if (audience === 'agent') {
    const subject = `Offer Submission: ${property} | Creative Structure (Full Commission Protected) - ${buyerEntity}`;
    
    const body = `Dear Listing Agent,

I hope you are having a productive week.

On behalf of ${buyerEntity}, we have reviewed the property at ${property} and are excited to submit a clean, highly reliable creative purchase offer. 

We recognize that maximizing net proceeds for your seller while guaranteeing your full listing & cooperating commissions is paramount. Our offer is structured to provide an expeditious closing with zero financing contingencies, purchasing the property completely "As-Is".

OFFER OVERVIEW & KEY TERMS:
• Property: ${property}
• Purchase Price: ${price}
• Deal Structure: ${inputs.dealStructure}
• Proposed Down Payment: ${downPayment} paid at close of escrow
• ${isSubTo ? 'Existing Underlying Mortgage' : 'Seller Carryback Loan Amount'}: ${loanBalance}
• Monthly Payment to be Serviced: ${monthlyPayment}/mo (${terms})
• Agent Commission: Full commission protected and disbursed directly through escrow at closing
• Earnest Money Deposit: Placed within 48 hours of mutual execution
• Inspection Period: ${inspectionDays} calendar days (informational / property walkthrough)
• Target Closing Timeline: ${closingDays} business days through a reputable local title & escrow company

WHY THIS OFFER PROVIDES CERTAINTY FOR YOUR CLIENT:
1. Speed & Execution: Because this structure eliminates traditional mortgage underwriting and loan officer approvals, we avoid the appraisal delays, strict underwriting condition letters, and fallout risks common with retail buyers.
2. Servicing & Compliance: ${isSubTo ? 'We utilize a licensed third-party loan servicing company (e.g., Weststar or NoteServicingCenter) to auto-draft monthly P&I, property taxes, and insurance directly, giving your seller absolute transparency and on-time verification.' : 'We execute a standard Promissory Note and recorded Deed of Trust/Mortgage, with monthly disbursements managed through an established loan servicing platform.'}
3. As-Is Purchase: We will not ask for repair credits, cosmetic concessions, or price reductions after signing.

We have proof of funds readily available to verify our entry fee and earnest money deposit. 

Please review this with your client at your earliest convenience. We are prepared to draft the standard state purchase agreement and creative financing addendum today upon agreement of principle.

Thank you for your professionalism, and I look forward to working toward a smooth closing.

Sincerely,

${buyerName}
Acquisitions & Investments
${buyerEntity}
Direct: ${buyerPhone}
Email: ${buyerEmail}
`;

    return { subject, body };
  }

  if (audience === 'seller') {
    const subject = `Private Purchase Proposal for ${property} - ${buyerEntity}`;

    const body = `Dear Property Owner,

Thank you for the opportunity to present an offer on your home at ${property}. 

At ${buyerEntity}, our goal is to deliver a smooth, stress-free transaction that accomplishes your financial goals without the headaches, continuous open-house walk-throughs, price negotiations, or closing delays typical of traditional home sales.

Here is how our proposed purchase works for you:

PROPOSED PURCHASE TERMS:
• Agreed Purchase Price: ${price}
• Cash Down Payment to You at Closing: ${downPayment}
• ${isSubTo ? 'Mortgage Relief (Subject-To)' : 'Seller Financing'}: ${isSubTo ? `We take over and service your existing mortgage balance of approximately ${loanBalance}, taking the burden of the ${monthlyPayment} monthly payment completely off your shoulders.` : `You receive predictable monthly income of ${monthlyPayment}/mo backed by a secured legal promissory note (${terms}).`}
• Condition: 100% As-Is. You will not spend a single dollar or minute making repairs, cleaning, or staging.
• Closing Timeline: We can close in as little as ${closingDays} days, or on a specific move-out date that aligns with your schedule.
• Closing Costs: We handle all closing costs and legal documentation with an experienced local title company.

HOW WE PROTECT YOU:
${isSubTo ? `• Transparent Third-Party Servicing: All monthly payments (${monthlyPayment}/mo) are handled through a licensed loan servicing company with automated bank drafting and online portal access so you can verify on-time payments every month.\n• Debt Burden Relieved: Your existing loan is paid faithfully on time, which can positively support your credit history while freeing up your monthly cash flow immediately.` : `• Secured Protection: Your seller loan is fully secured by a recorded Deed of Trust / Mortgage against the property. You earn passive interest income backed by real estate without any landlord or tenant responsibilities.`}

We understand that selling a property is an important decision. We pride ourselves on clear communication, transparency, and doing what we say we are going to do.

Would you be open to a brief 10-minute phone conversation today or tomorrow to discuss this proposal and answer any questions?

Warm regards,

${buyerName}
${buyerEntity}
Phone: ${buyerPhone}
Email: ${buyerEmail}
`;

    return { subject, body };
  }

  if (audience === 'loi') {
    const subject = `LETTER OF INTENT (LOI): ${property} - ${buyerEntity}`;

    const body = `LETTER OF INTENT TO PURCHASE REAL PROPERTY

DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
PURCHASER: ${buyerEntity} (or its designated assignee)
PROPERTY: ${property}

This Letter of Intent ("LOI") outlines the principal commercial terms under which Purchaser proposes to acquire the real property referenced above.

1. PURCHASE PRICE:
The total agreed purchase price shall be ${price} (U.S. Dollars).

2. FINANCING STRUCTURE:
Transaction to be executed via: ${inputs.dealStructure}
• Cash Down Payment: ${downPayment} due at Closing.
• ${isSubTo ? 'Underlying Debt' : 'Seller Financed Note'}: ${loanBalance}.
• Debt Service & Payment: Monthly payment of ${monthlyPayment}.
• Note / Financing Terms: ${terms}.

3. EARNEST MONEY DEPOSIT:
Within two (2) business days following mutual execution of a formal Purchase & Sale Agreement, Purchaser shall deposit standard Earnest Money with the designated Title & Escrow Company.

4. DUE DILIGENCE & INSPECTION:
Purchaser shall have ${inspectionDays} calendar days from contract execution to review physical condition and clear title ("Inspection Period").

5. TITLE & ESCROW:
Closing shall take place within ${closingDays} calendar days of contract execution through an agreed, licensed Title Company or Real Estate Closing Attorney. Purchaser to cover customary buyer closing expenses.

6. LOAN SERVICING & SERVICING AGREEMENT:
All ongoing debt obligations and note disbursements shall be administered via a licensed third-party servicing institution (e.g., Escrow Services / Loan Servicer) with automatic debiting and seller escrow reporting.

7. LEGAL EFFECT:
This LOI constitutes a statement of mutual intent and business terms. Upon acceptance, the parties agree to negotiate and execute a definitive Real Estate Purchase and Sale Agreement incorporating these terms.

CONFIRMED & ACCEPTED:

Purchaser: _____________________________       Date: _______________
${buyerEntity}

Seller / Authorized Signer: ______________       Date: _______________
`;

    return { subject, body };
  }

  // Executive summary pitch
  const subject = `Creative Offer Summary: ${property} | ${price}`;
  const body = `CREATIVE FINANCING TERM SUMMARY
Property: ${property}
Buyer Entity: ${buyerEntity}

1. Commercial Numbers:
• Purchase Price: ${price}
• Structure: ${inputs.dealStructure}
• Down Payment: ${downPayment}
• Loan / Principal Balance: ${loanBalance}
• Monthly Debt Service: ${monthlyPayment}/mo
• Agreed Terms: ${terms}

2. Operational Metrics:
• Estimated Entry Fee: ${formatCurrency(results.totalEntryFee)} (Includes 3% Title/Escrow)
• Target Market Rent: ${formatCurrency(results.monthlyRent)}/mo
• Est. Monthly Cash Flow: ${formatCurrency(results.monthlyCashFlow)}/mo (after 20% OpEx)
• Cash-on-Cash Return: ${results.cashOnCashReturn.toFixed(1)}%

3. Closing Timeline:
• Feasible Close: ${closingDays} Days
• Inspection Period: ${inspectionDays} Days
• As-Is Condition, No Retail Bank Financing Contingencies

Contact: ${buyerName} | ${buyerEmail} | ${buyerPhone}
`;

  return { subject, body };
}
