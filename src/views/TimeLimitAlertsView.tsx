import React, { useState } from 'react';
import {
  BellRing,
  Phone,
  Smartphone,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Send,
  Sparkles,
  Save,
  MessageSquare,
  Lock,
  Moon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialMediaPlatform } from '../types';

export const TimeLimitAlertsView: React.FC = () => {
  const {
    childrenList,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    appUsages,
    updateAppLimit,
    updateTotalDailyLimit,
    parentPhone,
    setParentPhone,
    notifications,
    triggerManualAlert,
  } = useApp();

  const [phoneInput, setPhoneInput] = useState(parentPhone);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [savePhoneSuccess, setSavePhoneSuccess] = useState(false);
  const [testAppSelected, setTestAppSelected] = useState<SocialMediaPlatform>('TikTok');
  const [testTimeInput, setTestTimeInput] = useState<number>(55);
  const [nightCurfewEnabled, setNightCurfewEnabled] = useState(true);
  const [warningAt80Enabled, setWarningAt80Enabled] = useState(true);

  const childApps = appUsages[selectedChild.id] || [];

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    setParentPhone(phoneInput);
    setIsEditingPhone(false);
    setSavePhoneSuccess(true);
    setTimeout(() => setSavePhoneSuccess(false), 2500);
  };

  const handleTestAlert = () => {
    triggerManualAlert(testAppSelected, testTimeInput);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <BellRing className="w-4 h-4" />
            Automated Parent Notification Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-1">
            Time Limits & Parent SMS Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Configure custom screen time ceilings for <strong>{selectedChild.name}</strong>. SafeScroll dispatches instant SMS alerts to your phone when rules are broken.
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md border border-slate-200">
          {childrenList.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChildId(c.id)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                c.id === selectedChild.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {savePhoneSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Parent alert phone number successfully updated to {parentPhone}.</span>
        </div>
      )}

      {/* Grid: Parent Phone Settings & Automated Notification Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Parent Phone & Alert Engine */}
        <div className="lg:col-span-5 space-y-6">
          {/* Phone Number Config Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Parent Alert Phone Number
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Receives real-time SMS whenever time limit is exceeded
                  </p>
                </div>
              </div>

              {!isEditingPhone && (
                <button
                  onClick={() => setIsEditingPhone(true)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingPhone ? (
              <form onSubmit={handleSavePhone} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone Number (with Country Code)
                  </label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneInput(parentPhone);
                      setIsEditingPhone(false);
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                    Configured Recipient
                  </span>
                  <p className="text-base font-bold text-slate-900 font-mono mt-0.5">
                    {parentPhone}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SMS Active
                </span>
              </div>
            )}

            {/* Notification Trigger Preferences */}
            <div className="pt-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Automated SMS Trigger Policies
              </h4>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Instant Over-Limit Breach SMS
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Dispatched immediately when an app limit is crossed
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Always On
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Bedtime Curfew Alert (Past 9:30 PM)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Alerts parent if screen usage occurs past bedtime
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNightCurfewEnabled(!nightCurfewEnabled)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                    nightCurfewEnabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      nightCurfewEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      80% Warning Pre-Notification
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Sends advisory SMS 10 minutes before hard limit
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWarningAt80Enabled(!warningAt80Enabled)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                    warningAt80Enabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      warningAt80Enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Test Trigger Box */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold">Simulate Parent SMS Alert</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Live Test</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Trigger a live over-limit SMS alert to preview the exact notification sent to your phone.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Select App</label>
                  <select
                    value={testAppSelected}
                    onChange={(e) => setTestAppSelected(e.target.value as SocialMediaPlatform)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Snapchat">Snapchat</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Discord">Discord</option>
                    <option value="Roblox">Roblox</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Simulated Minutes</label>
                  <input
                    type="number"
                    value={testTimeInput}
                    onChange={(e) => setTestTimeInput(parseInt(e.target.value) || 30)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              <button
                onClick={handleTestAlert}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Simulated SMS
              </button>
            </div>
          </div>
        </div>

        {/* Right Card: Per-App Time Limit Sliders */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                Custom Time Budgets for {selectedChild.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set individual minute caps for each social media app
              </p>
            </div>

            {/* Daily Total Budget Control */}
            <div className="flex items-center gap-2 p-1.5 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-xs text-slate-700 font-semibold">Total Daily Cap:</span>
              <select
                value={selectedChild.dailyTotalLimitMinutes}
                onChange={(e) =>
                  updateTotalDailyLimit(selectedChild.id, parseInt(e.target.value))
                }
                className="bg-white border border-blue-200 text-blue-900 font-bold text-xs rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={60}>60 mins (1 hr)</option>
                <option value={90}>90 mins (1.5 hrs)</option>
                <option value={120}>120 mins (2 hrs)</option>
                <option value={150}>150 mins (2.5 hrs)</option>
                <option value={180}>180 mins (3 hrs)</option>
              </select>
            </div>
          </div>

          {/* List of Apps with Interactive Sliders */}
          <div className="space-y-3">
            {childApps.map((app) => {
              const isBreached = app.timeSpentMinutes > app.limitMinutes;
              const percent = Math.min(100, Math.round((app.timeSpentMinutes / app.limitMinutes) * 100));

              return (
                <div
                  key={app.platform}
                  className={`p-4 rounded-xl border transition-all ${
                    isBreached
                      ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-200'
                      : 'bg-slate-50/70 border-slate-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-xs"
                        style={{ backgroundColor: app.color }}
                      >
                        <Smartphone className="w-4 h-4 text-slate-900" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">
                            {app.platform}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-medium">
                            {app.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Tracked today: <strong className={isBreached ? 'text-rose-600 font-bold' : 'text-slate-900'}>{app.timeSpentMinutes} mins</strong> ({percent}% of budget)
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded">
                        Limit: {app.limitMinutes}m
                      </span>
                      {isBreached && (
                        <span className="block text-[10px] text-rose-600 font-bold mt-1">
                          ⚠️ SMS Sent
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Slider & Quick Preset Buttons */}
                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="15"
                        max="120"
                        step="5"
                        value={app.limitMinutes}
                        onChange={(e) =>
                          updateAppLimit(selectedChild.id, app.platform, parseInt(e.target.value))
                        }
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <span className="text-xs font-bold text-slate-700 w-16 text-right">
                        {app.limitMinutes} mins
                      </span>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Quick preset:</span>
                      {[15, 30, 45, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => updateAppLimit(selectedChild.id, app.platform, mins)}
                          className={`px-2 py-0.5 text-[10px] rounded border font-semibold transition-colors ${
                            app.limitMinutes === mins
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Parent SMS Notification History Logs */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-blue-900">
                SMS Notification Transmission Log
              </h3>
              <p className="text-xs text-slate-500">
                Historical record of all alerts delivered to phone number: <strong>{parentPhone}</strong>
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            {notifications.length} Total Alerts Logged
          </span>
        </div>

        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                n.severity === 'critical'
                  ? 'bg-rose-50/50 border-rose-200'
                  : 'bg-amber-50/40 border-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-md shrink-0 mt-0.5 ${
                    n.severity === 'critical'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {n.childName} — {n.platform}
                    </span>
                    <span className="text-[11px] text-slate-500">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-snug">
                    {n.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  SMS Delivered
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
