import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Mail,
  Users,
  FileCheck,
  Send,
  Sparkles,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { DealInputs, DealCalculationResults, PitchAudience } from '../types/deal';
import { generatePitchScript } from '../utils/pitchGenerator';

interface PitchGeneratorPanelProps {
  inputs: DealInputs;
  results: DealCalculationResults;
}

export const PitchGeneratorPanel: React.FC<PitchGeneratorPanelProps> = ({
  inputs,
  results,
}) => {
  const [audience, setAudience] = useState<PitchAudience>('agent');
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // Re-generate pitch whenever inputs, results, or selected audience changes
  useEffect(() => {
    const pitch = generatePitchScript(inputs, results, audience);
    setSubject(pitch.subject);
    setBody(pitch.body);
  }, [inputs, results, audience]);

  const handleCopy = async () => {
    try {
      const fullText = `SUBJECT: ${subject}\n\n${body}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleDownloadText = () => {
    const fullText = `SUBJECT: ${subject}\n\n${body}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Offer_Pitch_${inputs.propertyAddress ? inputs.propertyAddress.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30) : 'Deal'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="pitch-generator-section"
      className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Mail className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Professional Pitch Script &amp; Offer Draft
            </h2>
            <p className="text-xs text-slate-400">
              Tailored for polite, professional communication highlighting clean execution and speed.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadText}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            title="Download pitch script as a plain text file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save .txt</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-md active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-100" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Offer to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Audience Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Select Pitch Audience &amp; Format:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setAudience('agent')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                audience === 'agent'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Listing Agent</span>
            </button>

            <button
              type="button"
              onClick={() => setAudience('seller')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                audience === 'seller'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Direct to Seller</span>
            </button>

            <button
              type="button"
              onClick={() => setAudience('loi')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                audience === 'loi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Legal LOI Term Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setAudience('executive')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                audience === 'executive'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Summary</span>
            </button>
          </div>
        </div>

        {/* Pitch Strategy Badge / Description */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Edit3 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {audience === 'agent' && (
              <>
                <strong className="text-white">Listing Agent Angle:</strong> Emphasizes that their full 
                commission is protected and disbursed directly from escrow, highlights an As-Is quick close 
                with no traditional bank financing fallout, and provides proof of entry funds.
              </>
            )}
            {audience === 'seller' && (
              <>
                <strong className="text-white">Direct Seller Angle:</strong> Compassionate, consultative tone 
                solving debt obligations or providing steady monthly income, highlighting licensed third-party 
                servicing and zero fees or repair costs.
              </>
            )}
            {audience === 'loi' && (
              <>
                <strong className="text-white">Letter of Intent (LOI):</strong> A formal, non-binding commercial 
                term sheet ready to present to an attorney, broker, or institutional seller with signature blocks.
              </>
            )}
            {audience === 'executive' && (
              <>
                <strong className="text-white">Executive Summary:</strong> High-level financial synopsis perfect 
                for quick text messaging, partner updates, or preliminary screening before submitting full documents.
              </>
            )}
          </p>
        </div>

        {/* Email Subject Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Email Subject Line:
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Body / Script (Editable) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pitch Script Body (Editable):
            </label>
            <span className="text-[11px] text-slate-400">
              Feel free to tweak text before copying
            </span>
          </div>
          <div className="relative">
            <textarea
              rows={14}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
        </div>

        {/* Bottom Copy CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Clicking copy copies both subject line and complete body to your clipboard.
          </span>
          <button
            onClick={handleCopy}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-100" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Offer to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
