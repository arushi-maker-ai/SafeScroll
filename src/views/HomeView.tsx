import React, { useState } from 'react';
import {
  Brain,
  Moon,
  Zap,
  HeartPulse,
  ShieldAlert,
  Smartphone,
  BellRing,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Sparkles,
  Users,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IMPACT_TOPICS } from '../data/defaultData';

export const HomeView: React.FC = () => {
  const { setActiveTab, selectedChild, parentPhone, triggerManualAlert } = useApp();
  const [selectedTopicId, setSelectedTopicId] = useState<string>('dopamine');

  // Interactive quick calculator state
  const [dailyHours, setDailyHours] = useState<number>(3.5);
  const [hasLateNight, setHasLateNight] = useState<boolean>(true);

  const selectedTopic =
    IMPACT_TOPICS.find((t) => t.id === selectedTopicId) || IMPACT_TOPICS[0];

  // Calculate quick risk score
  const calculateRisk = () => {
    let score = dailyHours * 20;
    if (hasLateNight) score += 25;
    if (score < 40) return { label: 'Low Risk', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score < 75) return { label: 'Moderate Impact', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { label: 'High Concern', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
  };

  const risk = calculateRisk();

  return (
    <div className="space-y-8 pb-12">
      {/* Top Hero Banner & Overview */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Under-18 Youth Digital Health & Parental Safety Platform
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 leading-tight">
              Understanding Social Media Impact on Kids & Teens
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              Adolescent brains are uniquely vulnerable to algorithm-driven reward loops and infinite scroll feeds. ShieldKids equips parents with automated SMS threshold alerts when limits are breached, transparent cross-app usage logs, and pediatric clinical recommendations.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('history')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-xs"
              >
                <TrendingUp className="w-4 h-4" />
                View Child Time History
              </button>

              <button
                onClick={() => setActiveTab('timelimits')}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs"
              >
                <BellRing className="w-4 h-4 text-blue-600" />
                Set Parent Phone Alerts
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className="bg-slate-100 text-slate-700 hover:text-blue-900 px-3.5 py-2 rounded-md text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-blue-600" />
                Live Kid Simulator
              </button>
            </div>
          </div>

          {/* Right Column: Circular Gauge & Metric Boxes */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-32 h-32 bg-white rounded-full border-8 border-blue-600 flex items-center justify-center flex-col shadow-xs">
              <span className="text-2xl font-bold text-slate-800">
                {selectedChild.currentUsageTodayMinutes}m
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                of {selectedChild.dailyTotalLimitMinutes}m limit
              </span>
            </div>

            <div className="w-full mt-4 flex gap-2">
              <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 flex-1 text-center">
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block mb-0.5">
                  Today's Usage
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {Math.round(selectedChild.currentUsageTodayMinutes / 60 * 10) / 10}h
                </span>
              </div>
              <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-100 flex-1 text-center">
                <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider block mb-0.5">
                  Max Limit
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {Math.round(selectedChild.dailyTotalLimitMinutes / 60 * 10) / 10}h
                </span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500 text-center font-medium">
              Active child: <strong className="text-slate-800">{selectedChild.name}</strong> • SMS: <span className="font-mono text-blue-900 font-semibold">{parentPhone}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistical Highlights on Youth Social Media */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Teen Screen Time</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">4.8 Hours</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Per day on social platforms for U.S. teens (Pew Research)</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sleep Disruption Rate</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">68% of Youths</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Lose over 1 hour of sleep due to nighttime phone usage</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Surgeon General Advisory</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">2x Risk</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Higher anxiety/depression symptoms for &gt;3h daily use</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Parent Alert Efficacy</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">64% Fewer Battles</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">When automated SMS limit notifications are active</p>
        </div>
      </section>

      {/* Main Educational Pillar: Interactive Core Impact Explorer */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              Scientific & Psychological Evidence
            </div>
            <h2 className="text-xl font-bold text-blue-900 mt-1">
              How Social Media Affects Under-18 Brains & Wellbeing
            </h2>
          </div>

          {/* Topic Selectors */}
          <div className="flex flex-wrap gap-2">
            {IMPACT_TOPICS.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {topic.title.split('&')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Topic Detailed Card */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Big Insight & Stat */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedTopic.title}
                </h3>
                <p className="text-xs text-blue-600 font-semibold mt-0.5">
                  {selectedTopic.subtitle}
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {selectedTopic.description}
            </p>

            {/* Scientific Citation */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong className="text-slate-800">Clinical Reference:</strong> {selectedTopic.scientificRef}
              </span>
            </div>

            {/* Identified Risks */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Documented Risks for Kids Under 18
              </h4>
              <ul className="space-y-2">
                {selectedTopic.risks.map((riskItem, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 bg-rose-50/70 p-2.5 rounded-lg border border-rose-100"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{riskItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Healthy Guidelines & Actionable Tips */}
          <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-200 space-y-4">
            {/* Stat Callout */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
              <span className="text-2xl font-bold text-blue-600 block">
                {selectedTopic.stat}
              </span>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {selectedTopic.statLabel}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Actionable Parent & Teen Strategies
              </h4>
              <div className="space-y-2">
                {selectedTopic.healthyTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs"
                  >
                    <div className="w-5 h-5 rounded bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('timelimits')}
              className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <BellRing className="w-4 h-4" />
              Configure Time Limits for {selectedChild.name.split(' ')[0]}
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Youth Digital Impact Quick Assessment Calculator */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            Interactive Tool for Parents
          </div>
          <h2 className="text-xl font-bold text-blue-900">
            Quick Screen Time Impact Estimator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Adjust your child’s typical daily habits to estimate cognitive and sleep vulnerability.
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
            {/* Daily Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800">
                  Daily Social Media Usage:
                </label>
                <span className="text-xs font-bold text-blue-700 px-2 py-0.5 bg-blue-50 rounded border border-blue-200">
                  {dailyHours} Hours / day
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>30m (Ideal)</span>
                <span>2h (Max recommended)</span>
                <span>6+h (Severe)</span>
              </div>
            </div>

            {/* Bedtime toggle */}
            <div className="flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-800 mb-2">
                Nighttime Scrolling (Past 9:30 PM):
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHasLateNight(true)}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold border transition-all ${
                    hasLateNight
                      ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🌙 In bedroom
                </button>
                <button
                  type="button"
                  onClick={() => setHasLateNight(false)}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold border transition-all ${
                    !hasLateNight
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ☀️ Docked outside
                </button>
              </div>
            </div>
          </div>

          {/* Assessment Result Box */}
          <div className={`mt-4 p-4 rounded-xl border ${risk.border} ${risk.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded bg-white shadow-xs border ${risk.color}`}>
                  {risk.label}
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  Estimated impact level based on {dailyHours}h/day
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-1.5">
                {dailyHours > 2.5
                  ? `At ${dailyHours} hours daily, adolescent dopamine receptors require regular reset intervals. Automated parent notifications are recommended.`
                  : `A balanced ${dailyHours} hours limit maintains healthy social connectedness without degrading school focus.`}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('assessment')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-md text-xs font-semibold shadow-xs shrink-0 flex items-center gap-1.5 transition-colors"
            >
              Take Full Assessment <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Parental Shield Feature Callout */}
      <section className="bg-slate-900 rounded-xl p-6 sm:p-8 text-white border border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <BellRing className="w-5 h-5 text-blue-400" />
              Automated Parental SMS Notification System
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Whenever an under-18 child exceeds either their overall daily quota or individual app allowances (e.g. &gt;45m TikTok or &gt;30m Instagram), our engine immediately dispatches a direct SMS alert to the parent's phone number: <strong className="text-blue-300">{parentPhone}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              onClick={() => triggerManualAlert('Instagram', 42)}
              className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Send Demo Parent Alert Now
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="w-full py-2 px-4 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Inspect Kids Usage History
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
