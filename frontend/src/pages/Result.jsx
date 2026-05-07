import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, ArrowLeft, RefreshCw, FileText, ClipboardList, Activity, Stethoscope } from 'lucide-react';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { prediction, probability, risk_tier, inputs } = location.state || {};

  if (!prediction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-200 mb-4">No Prediction Data Found</h2>
        <button 
          onClick={() => navigate('/predict')}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const isResistant = prediction === "Resistant";
  
  // Format probability as percentage
  let pct = (probability * 100).toFixed(1);

  // Generate Advice
  const getAdvice = () => {
    if (isResistant) {
      if (risk_tier === "High") {
        return [
          "URGENT: Isolate patient to prevent potential spread of multi-drug resistant organism.",
          "Immediately review and escalate to broader-spectrum or combination antibiotic therapy.",
          "Request full culture and susceptibility testing from the lab.",
          "Monitor patient vitals closely for signs of sepsis."
        ];
      }
      return [
        "Re-evaluate current empiric antibiotic choice.",
        "Consider alternative antibiotics with different mechanisms of action.",
        "Await lab culture results to confirm resistance profile before finalising treatment."
      ];
    } else {
      if (risk_tier === "Low") {
        return [
          "Standard empiric antibiotic therapy is highly likely to be effective.",
          "Continue monitoring patient for clinical improvement.",
          "Promote antimicrobial stewardship by using targeted, narrow-spectrum antibiotics if possible."
        ];
      }
      return [
        "Standard antibiotic protocols are recommended.",
        "Ensure patient completes the full course to prevent future resistance.",
        "Review clinical progress within 48 hours."
      ];
    }
  };

  const adviceList = getAdvice();

  return (
    <div className="max-w-3xl mx-auto w-full animate-in zoom-in-95 duration-500 pb-12">
      
      <div className={`
        relative overflow-hidden rounded-3xl p-8 mb-8 border backdrop-blur-md shadow-2xl
        ${isResistant 
          ? 'bg-red-950/20 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)]' 
          : 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]'
        }
      `}>
        {/* Decorative background circle */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 ${isResistant ? 'bg-red-500' : 'bg-emerald-500'}`} />
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className={`p-5 rounded-2xl mb-6 shadow-xl ${isResistant ? 'bg-red-500/20 shadow-red-500/20' : 'bg-emerald-500/20 shadow-emerald-500/20'}`}>
            {isResistant ? <ShieldAlert className="w-16 h-16 text-red-500" /> : <ShieldCheck className="w-16 h-16 text-emerald-500" />}
          </div>
          
          <h2 className="text-sm tracking-widest uppercase font-semibold text-slate-400 mb-2">Model Prediction</h2>
          
          <h1 className={`text-5xl font-black tracking-tight mb-4 ${isResistant ? 'text-red-400' : 'text-emerald-400'}`}>
            {prediction}
          </h1>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50">
              <span className="text-slate-300 text-sm">Confidence Score:</span>
              <span className={`font-mono font-bold ${isResistant ? 'text-red-300' : 'text-emerald-300'}`}>
                {pct}%
              </span>
            </div>
            {risk_tier && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50">
                <span className="text-slate-300 text-sm">Risk Tier:</span>
                <span className={`font-mono font-bold ${
                  risk_tier === 'High' ? 'text-red-400' : 
                  risk_tier === 'Moderate' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {risk_tier}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Clinical Advice Report */}
        <div className="bg-slate-800/40 border border-slate-700 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
            <Stethoscope className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-slate-200">Clinical Advice</h3>
          </div>
          <ul className="space-y-3">
            {adviceList.map((advice, idx) => (
              <li key={idx} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Patient Summary Card */}
        <div className="bg-slate-800/40 border border-slate-700 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
            <ClipboardList className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-slate-200">Patient Data Summary</h3>
          </div>
          {inputs ? (
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Age</span>
                <span className="text-slate-200 font-medium">{inputs.age} years</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Gender</span>
                <span className="text-slate-200 font-medium">{inputs.gender === 0 ? 'Male' : 'Female'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Infection</span>
                <span className="text-slate-200 font-medium">
                  {inputs.infection_type === 0 ? 'E. coli' : inputs.infection_type === 1 ? 'K. pneumoniae' : 'S. aureus'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Prev Antibiotics</span>
                <span className="text-slate-200 font-medium">{inputs.prev_antibiotic_usage === 1 ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">WBC Count</span>
                <span className="text-slate-200 font-medium">{inputs.wbc_count} x10⁹/L</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Hospital Stay</span>
                <span className="text-slate-200 font-medium">{inputs.hospitalization_days} days</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No patient data available.</p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={() => navigate('/predict')}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> New Prediction
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 rounded-xl text-white font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        >
          <FileText className="w-4 h-4" /> Print Report
        </button>
      </div>

    </div>
  );
}
