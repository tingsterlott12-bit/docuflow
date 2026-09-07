'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calculator,
  DollarSign,
  TrendingUp,
  PieChart,
  Save,
  Download,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function WorksheetDrawer({ isOpen, onClose, initialTab = 'networth' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [savedToast, setSavedToast] = useState(false);

  // Worksheet 1: Net Worth
  const [assets, setAssets] = useState({
    cash: 45000,
    equities: 185000,
    realEstate: 420000,
    other: 35000
  });

  const [liabilities, setLiabilities] = useState({
    mortgage: 290000,
    loans: 18000,
    credit: 3500
  });

  // Worksheet 2: Cash Flow
  const [cashFlow, setCashFlow] = useState({
    monthlyIncome: 12500,
    taxes: 3100,
    housing: 2400,
    living: 2200,
    discretionary: 1400
  });

  // Worksheet 3: Compound Simulator
  const [simulator, setSimulator] = useState({
    startingCapital: 50000,
    monthlyAddition: 2500,
    annualReturn: 8.5,
    years: 20
  });

  // Load from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('brw_embedded_workbook');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.assets) setAssets(parsed.assets);
          if (parsed.liabilities) setLiabilities(parsed.liabilities);
          if (parsed.cashFlow) setCashFlow(parsed.cashFlow);
          if (parsed.simulator) setSimulator(parsed.simulator);
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Calculations
  const totalAssets = Object.values(assets).reduce((a, b) => Number(a) + Number(b), 0);
  const totalLiabilities = Object.values(liabilities).reduce((a, b) => Number(a) + Number(b), 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) : 0;

  const totalMonthlyExpenses = cashFlow.taxes + cashFlow.housing + cashFlow.living + cashFlow.discretionary;
  const monthlySurplus = Math.max(0, cashFlow.monthlyIncome - totalMonthlyExpenses);
  const savingsRate = cashFlow.monthlyIncome > 0
    ? (((monthlySurplus) / (cashFlow.monthlyIncome - cashFlow.taxes)) * 100).toFixed(1)
    : 0;

  // Compounding math: FV = P*(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)]
  const r = (simulator.annualReturn / 100) / 12;
  const n = simulator.years * 12;
  const futureValue = Math.round(
    simulator.startingCapital * Math.pow(1 + r, n) +
    simulator.monthlyAddition * ((Math.pow(1 + r, n) - 1) / r)
  );
  const totalContributions = simulator.startingCapital + simulator.monthlyAddition * n;
  const compoundGains = Math.max(0, futureValue - totalContributions);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      const data = { assets, liabilities, cashFlow, simulator, savedAt: new Date().toISOString() };
      localStorage.setItem('brw_embedded_workbook', JSON.stringify(data));
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    }
  };

  const handleExportJSON = () => {
    const data = {
      title: 'Building Real Wealth — Personal Financial Blueprint',
      exportedAt: new Date().toISOString(),
      netWorthSummary: { totalAssets, totalLiabilities, netWorth, debtToAssetRatio: `${debtToAssetRatio}%` },
      cashFlowSummary: { monthlyIncome: cashFlow.monthlyIncome, monthlySurplus, savingsRate: `${savingsRate}%` },
      compoundProjection: { horizonYears: simulator.years, projectedFutureValue: futureValue, compoundGains }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BRW_Financial_Blueprint_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Interactive Financial Worksheets</h2>
                <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-semibold border border-brand-500/30">
                  Live Calculator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Building Real Wealth curriculum companion toolkit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('networth')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'networth'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>1.1 Net Worth Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('cashflow')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'cashflow'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>1.2 Cash Flow Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('compound')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'compound'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>1.3 Compound Simulator</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: Net Worth Blueprint */}
          {activeTab === 'networth' && (
            <div className="space-y-6">
              {/* Metric Hero */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-950 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Calculated Net Worth</span>
                  <div className="text-3xl font-extrabold text-white tracking-tight mt-1">
                    ${netWorth.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-6">
                  <div>
                    <div className="text-slate-400">Total Assets</div>
                    <div className="font-bold text-emerald-400">${totalAssets.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Liabilities</div>
                    <div className="font-bold text-rose-400">${totalLiabilities.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Debt Ratio</div>
                    <div className="font-bold text-brand-400">{debtToAssetRatio}%</div>
                  </div>
                </div>
              </div>

              {/* Assets Form */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span>Gross Assets</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">Liquid Cash & Sweep Accounts ($)</label>
                    <input
                      type="number"
                      value={assets.cash}
                      onChange={(e) => setAssets({ ...assets, cash: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Retirement & Equities Portfolio ($)</label>
                    <input
                      type="number"
                      value={assets.equities}
                      onChange={(e) => setAssets({ ...assets, equities: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Primary & Investment Real Estate ($)</label>
                    <input
                      type="number"
                      value={assets.realEstate}
                      onChange={(e) => setAssets({ ...assets, realEstate: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Business Equity & Other ($)</label>
                    <input
                      type="number"
                      value={assets.other}
                      onChange={(e) => setAssets({ ...assets, other: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Liabilities Form */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <span>Liabilities & Debts</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">Mortgage Balance ($)</label>
                    <input
                      type="number"
                      value={liabilities.mortgage}
                      onChange={(e) => setLiabilities({ ...liabilities, mortgage: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Auto & Student Loans ($)</label>
                    <input
                      type="number"
                      value={liabilities.loans}
                      onChange={(e) => setLiabilities({ ...liabilities, loans: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Credit Card & Other ($)</label>
                    <input
                      type="number"
                      value={liabilities.credit}
                      onChange={(e) => setLiabilities({ ...liabilities, credit: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Cash Flow Engine */}
          {activeTab === 'cashflow' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-950 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Investment Surplus</span>
                  <div className="text-3xl font-extrabold text-emerald-400 tracking-tight mt-1">
                    ${monthlySurplus.toLocaleString()}
                    <span className="text-xs text-slate-400 font-normal"> / mo</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-6">
                  <div>
                    <div className="text-slate-400">Savings Rate</div>
                    <div className="font-bold text-brand-400">{savingsRate}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Annualized</div>
                    <div className="font-bold text-white">${(monthlySurplus * 12).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400">Monthly Gross Revenue / Income ($)</label>
                  <input
                    type="number"
                    value={cashFlow.monthlyIncome}
                    onChange={(e) => setCashFlow({ ...cashFlow, monthlyIncome: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Estimated Income Taxes & FICA ($)</label>
                  <input
                    type="number"
                    value={cashFlow.taxes}
                    onChange={(e) => setCashFlow({ ...cashFlow, taxes: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Housing & Utilities ($)</label>
                  <input
                    type="number"
                    value={cashFlow.housing}
                    onChange={(e) => setCashFlow({ ...cashFlow, housing: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Fixed Living Essentials & Groceries ($)</label>
                  <input
                    type="number"
                    value={cashFlow.living}
                    onChange={(e) => setCashFlow({ ...cashFlow, living: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Discretionary & Lifestyle ($)</label>
                  <input
                    type="number"
                    value={cashFlow.discretionary}
                    onChange={(e) => setCashFlow({ ...cashFlow, discretionary: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Compound Wealth Simulator */}
          {activeTab === 'compound' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 to-slate-950 border border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">Projected Portfolio in {simulator.years} Years</span>
                  <div className="text-3xl font-extrabold text-white tracking-tight mt-1">
                    ${futureValue.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs border-t sm:border-t-0 sm:border-l border-indigo-900 pt-3 sm:pt-0 sm:pl-6">
                  <div>
                    <div className="text-slate-400">Principal</div>
                    <div className="font-bold text-slate-200">${totalContributions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-indigo-300">Compound Gains</div>
                    <div className="font-bold text-emerald-400">+${compoundGains.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">Starting Portfolio ($)</label>
                    <input
                      type="number"
                      value={simulator.startingCapital}
                      onChange={(e) => setSimulator({ ...simulator, startingCapital: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Monthly Contribution ($)</label>
                    <input
                      type="number"
                      value={simulator.monthlyAddition}
                      onChange={(e) => setSimulator({ ...simulator, monthlyAddition: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Expected Return (% / yr)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={simulator.annualReturn}
                      onChange={(e) => setSimulator({ ...simulator, annualReturn: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Investment Horizon</span>
                    <span className="font-bold text-brand-400">{simulator.years} Years</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="1"
                    value={simulator.years}
                    onChange={(e) => setSimulator({ ...simulator, years: Number(e.target.value) })}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition"
            >
              {savedToast ? <CheckCircle2 className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
              <span>{savedToast ? 'Saved to Session!' : 'Save Progress'}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
              title="Download JSON Blueprint"
            >
              <Download className="w-4 h-4" />
              <span>Export Blueprint</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition px-3 py-2"
          >
            Back to FlipBook
          </button>
        </div>

      </div>
    </div>
  );
}
