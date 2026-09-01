import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Moon,
  Smartphone,
  PhoneCall,
  Search,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { SocialMediaPlatform } from '../types';

const COLORS = ['#00F2FE', '#E1306C', '#FFFC00', '#FF0000', '#00A2FF', '#5865F2', '#1DA1F2', '#BD081C'];

export const HistoryView: React.FC = () => {
  const {
    childrenList,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    appUsages,
    activityHistory,
    parentPhone,
    setActiveTab,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'latenight' | 'breached'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  // App breakdown for current child
  const childAppList = appUsages[selectedChild.id] || [];

  // Pie chart data
  const pieData = childAppList.map((app, idx) => ({
    name: app.platform,
    value: app.timeSpentMinutes,
    limit: app.limitMinutes,
    color: app.color || COLORS[idx % COLORS.length],
    breached: app.timeSpentMinutes > app.limitMinutes,
  }));

  // Bar chart data (Used vs Limit)
  const barData = childAppList.map((app) => ({
    platform: app.platform,
    Used: app.timeSpentMinutes,
    Limit: app.limitMinutes,
  }));

  // Filter activity records for selected child
  const childHistory = activityHistory.filter((item) => {
    if (item.childId !== selectedChild.id) return false;
    if (searchQuery && !item.platform.toLowerCase().includes(searchQuery.toLowerCase()) && !(item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    if (dateFilter === 'today') return item.date === '2026-08-31';
    if (dateFilter === 'latenight') return item.isLateNight;
    if (dateFilter === 'breached') return item.limitExceeded;
    return true;
  });

  const totalMinutes = childAppList.reduce((acc, curr) => acc + curr.timeSpentMinutes, 0);
  const breachedAppsCount = childAppList.filter((a) => a.timeSpentMinutes > a.limitMinutes).length;
  const lateNightSessions = activityHistory.filter((a) => a.childId === selectedChild.id && a.isLateNight).length;

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            Parental Activity Log & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-1">
            Social Media Time & Platform Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Detailed inspection of where <strong>{selectedChild.name}</strong> ({selectedChild.age} yrs) is spending screen time across various social apps.
          </p>
        </div>

        {/* Child Selector & Actions */}
        <div className="flex flex-wrap items-center gap-3">
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

          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-blue-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Export usage history report"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            Export Report
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Usage history report for {selectedChild.name} generated successfully. Ready for parent review.</span>
        </div>
      )}

      {/* Overview Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Tracked Today</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-bold text-blue-600">{totalMinutes} mins</span>
            <span className="text-xs text-slate-500">({(totalMinutes / 60).toFixed(1)} hrs)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Allowed daily: {selectedChild.dailyTotalLimitMinutes} mins
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Limit Breaches Today</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className={`text-2xl font-bold ${breachedAppsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {breachedAppsCount} {breachedAppsCount === 1 ? 'App' : 'Apps'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {breachedAppsCount > 0 ? 'SMS alerts dispatched to parent' : 'All within daily safety budget'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Late Night Sessions (&gt;9:30 PM)</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className={`text-2xl font-bold ${lateNightSessions > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {lateNightSessions} detected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bedtime screen time impacts sleep cycles
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Parent Alert SMS Status</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" /> Active
            </span>
            <span className="text-xs text-slate-700 font-mono font-semibold">{parentPhone}</span>
          </div>
          <button
            onClick={() => setActiveTab('timelimits')}
            className="text-xs text-blue-600 font-semibold hover:underline mt-1 block"
          >
            Configure Rules & Limits →
          </button>
        </div>
      </div>

      {/* Visual Analytics: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Where Time is Spent */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              Time Allocation by Social Platform
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proportion of screen time distributed across individual apps
            </p>
          </div>

          <div className="h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} mins (${item.payload.breached ? 'Over limit!' : 'OK'})`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            {pieData.map((app) => (
              <div key={app.name} className="flex items-center justify-between p-1.5 rounded bg-slate-50 text-xs border border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: app.color }}
                  />
                  <span className="font-semibold text-slate-800">{app.name}</span>
                </div>
                <span className={`font-bold ${app.breached ? 'text-rose-600' : 'text-slate-600'}`}>
                  {app.value}m
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Used vs Limit Comparison */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              Screen Time vs. Allowed Limit (Minutes)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare actual minutes spent versus daily limit per social app
            </p>
          </div>

          <div className="h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => [`${value} mins`]} />
                <Legend />
                <Bar dataKey="Used" fill="#2563EB" radius={[4, 4, 0, 0]} name="Actual Used (mins)" />
                <Bar dataKey="Limit" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Allowed Limit (mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Guidance info */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Apps with red tags trigger an SMS alert to your phone number: <strong>{parentPhone}</strong>.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('timelimits')}
              className="text-xs font-semibold text-blue-600 hover:underline shrink-0 ml-2"
            >
              Edit Limits
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Activity Log Table */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-blue-900">
              Detailed Activity Log & Time Record
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Timestamps, app sessions, late night flags, and parent notification status
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search app or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs font-semibold">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-2.5 py-1 rounded transition-all ${
                  dateFilter === 'all' ? 'bg-white text-blue-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-2.5 py-1 rounded transition-all ${
                  dateFilter === 'today' ? 'bg-white text-blue-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('breached')}
                className={`px-2.5 py-1 rounded transition-all ${
                  dateFilter === 'breached' ? 'bg-white text-rose-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Limit Exceeded
              </button>
              <button
                onClick={() => setDateFilter('latenight')}
                className={`px-2.5 py-1 rounded transition-all ${
                  dateFilter === 'latenight' ? 'bg-white text-indigo-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Late Night 🌙
              </button>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Date & Time</th>
                <th className="py-2.5 px-4">Social Platform</th>
                <th className="py-2.5 px-4">Duration</th>
                <th className="py-2.5 px-4">Time Flag</th>
                <th className="py-2.5 px-4">Parent SMS Notification</th>
                <th className="py-2.5 px-4">Session Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {childHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No activity logs match the selected filter.
                  </td>
                </tr>
              ) : (
                childHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.date}</div>
                      <div className="text-[11px] text-slate-500">{item.startTime} - {item.endTime}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-900 font-bold border border-blue-100">
                        <Smartphone className="w-3 h-3 text-blue-600" />
                        {item.platform}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-slate-900">
                        {item.durationMinutes} mins
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.limitExceeded && (
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Over Limit
                          </span>
                        )}
                        {item.isLateNight && (
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold flex items-center gap-1">
                            <Moon className="w-3 h-3" /> Late Night
                          </span>
                        )}
                        {!item.limitExceeded && !item.isLateNight && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            Balanced
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {item.notificationSentToPhone ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>SMS Sent to {item.notificationSentToPhone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">No alert needed</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {item.notes || 'Routine browsing'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
