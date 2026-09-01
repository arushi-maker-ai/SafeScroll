import React, { useState } from 'react';
import {
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Smartphone,
  Flame,
  AlertOctagon,
  ShieldCheck,
  Phone,
  Sparkles,
  Zap,
  Coffee,
  BookOpen,
  Bike,
  Smile,
  FastForward,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialMediaPlatform } from '../types';

export const KidLiveTrackerView: React.FC = () => {
  const {
    activeSession,
    startLiveSession,
    stopLiveSession,
    tickSessionTime,
    selectedChild,
    appUsages,
    parentPhone,
    setActiveTab,
  } = useApp();

  const [selectedApp, setSelectedApp] = useState<SocialMediaPlatform>('TikTok');
  const [speed, setSpeed] = useState<number>(5);

  const childApps = appUsages[selectedChild.id] || [];
  const activeAppObj = childApps.find((a) => a.platform === (activeSession.isRunning ? activeSession.platform : selectedApp));
  const currentLimit = activeAppObj ? activeAppObj.limitMinutes : 30;

  const elapsed = activeSession.elapsedMinutes;
  const isOverLimit = elapsed >= currentLimit;
  const progressPercent = Math.min(100, Math.round((elapsed / currentLimit) * 100));

  const appsList: { name: SocialMediaPlatform; color: string; desc: string }[] = [
    { name: 'TikTok', color: '#00F2FE', desc: 'Short-form algorithmic video feed' },
    { name: 'Instagram', color: '#E1306C', desc: 'Reels, Stories, & photo explorer' },
    { name: 'Snapchat', color: '#FFFC00', desc: 'Snapstreaks & direct disappearing chats' },
    { name: 'YouTube', color: '#FF0000', desc: 'Long-form videos & Shorts feed' },
    { name: 'Roblox', color: '#00A2FF', desc: 'Multiplayer 3D social gaming worlds' },
    { name: 'Discord', color: '#5865F2', desc: 'Community servers & voice chat rooms' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <PlayCircle className="w-4 h-4" />
            Live Kid Screen Time Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-1">
            Real-Time Screen Session & SMS Trigger
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Test how SafeScroll monitors active screen sessions for <strong>{selectedChild.name}</strong> and instantly alerts the parent when the time limit expires.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
          <Phone className="w-4 h-4 text-blue-600" />
          <div className="text-xs">
            <span className="text-slate-500 block">Parent SMS Recipient:</span>
            <strong className="text-blue-900 font-mono">{parentPhone}</strong>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: App Picker & Speed Controls */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Choose Social App to Simulate
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select which platform the kid is opening on their device
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {appsList.map((app) => {
              const isChosen = (activeSession.isRunning ? activeSession.platform : selectedApp) === app.name;
              return (
                <button
                  key={app.name}
                  disabled={activeSession.isRunning}
                  onClick={() => setSelectedApp(app.name)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isChosen
                      ? 'border-blue-600 bg-blue-50/80 ring-1 ring-blue-500/30 shadow-xs'
                      : 'border-slate-200 hover:border-blue-200 bg-slate-50/50'
                  } ${activeSession.isRunning && !isChosen ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{app.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: app.color }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{app.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Simulation Speed */}
          <div className="pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Simulation Clock Speed</span>
              <span className="text-blue-600 font-mono">{speed}x (Quick Test Mode)</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 5, 10].map((s) => (
                <button
                  key={s}
                  disabled={activeSession.isRunning}
                  onClick={() => setSpeed(s)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                    speed === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s === 1 ? '1x Realtime' : `${s}x Fast`}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              At 10x speed, each second simulates 10 minutes of screen time!
            </p>
          </div>

          {/* Manual Jump Buttons for instant testing */}
          {activeSession.isRunning && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
              <span className="text-xs font-bold text-blue-900 block">
                ⚡ Quick Time Fast-Forward:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => tickSessionTime(15)}
                  className="flex-1 py-1.5 bg-white hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-md border border-blue-200 flex items-center justify-center gap-1"
                >
                  <FastForward className="w-3.5 h-3.5" /> +15 mins
                </button>
                <button
                  onClick={() => tickSessionTime(currentLimit - elapsed)}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1 shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5" /> Hit Limit Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Simulated Smartphone Canvas */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Active Background pulse if running */}
          {activeSession.isRunning && (
            <div className={`absolute inset-0 pointer-events-none transition-colors ${
              isOverLimit ? 'bg-rose-500/5 animate-pulse' : 'bg-blue-500/5'
            }`} />
          )}

          {/* Smartphone Frame Simulation */}
          <div className="w-full max-w-sm rounded-[2rem] border-4 border-slate-800 bg-slate-950 text-white p-5 shadow-xl relative">
            {/* Phone Speaker Notch */}
            <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto mb-4" />

            {/* Active App Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-slate-200">
                  {activeSession.isRunning ? activeSession.platform : selectedApp} Active
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Live Visual Timer Display */}
            <div className="py-7 flex flex-col items-center justify-center">
              <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center relative transition-all ${
                isOverLimit
                  ? 'border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/20'
                  : progressPercent > 80
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-blue-500 bg-blue-500/10'
              }`}>
                <span className="text-2xl sm:text-3xl font-black font-mono">
                  {elapsed}m
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  of {currentLimit}m limit
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full mt-5 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverLimit ? 'bg-rose-500' : progressPercent > 80 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between w-full text-[11px] text-slate-400 mt-1.5">
                <span>0m</span>
                <span className="font-bold text-slate-200">{progressPercent}% Used</span>
                <span>{currentLimit}m</span>
              </div>
            </div>

            {/* Limit Status Badge */}
            {isOverLimit ? (
              <div className="p-2.5 rounded-lg bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>LIMIT EXCEEDED! Parent SMS Dispatched to {parentPhone}</span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Monitoring in background (SafeScroll Engine)</span>
              </div>
            )}
          </div>

          {/* Controller Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!activeSession.isRunning ? (
              <button
                id="simulator-start-btn"
                onClick={() => startLiveSession(selectedApp, speed)}
                className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                Start Simulation for {selectedApp}
              </button>
            ) : (
              <>
                <button
                  id="simulator-stop-btn"
                  onClick={stopLiveSession}
                  className="px-5 py-2.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
                >
                  <PauseCircle className="w-4 h-4" />
                  Stop & Save Session
                </button>

                <button
                  onClick={() => {
                    stopLiveSession();
                    startLiveSession(selectedApp, speed);
                  }}
                  className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                  title="Reset Simulator"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mindful Offline Alternatives for Kids */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
          <Smile className="w-4 h-4" />
          Healthy Offline Habits for Under-18 Youths
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-blue-900">
          What Kids Can Do When Social Media Time Expires
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Replacing algorithmic doomscrolling with restorative real-world experiences refreshes focus.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2 rounded-md bg-blue-50 text-blue-600 shrink-0">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">20-Min Outdoor Bike / Walk</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Natural sunlight boosts dopamine naturally and resets circadian rhythm.</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2 rounded-md bg-indigo-50 text-indigo-600 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Graphic Novel or Book</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Long-form narrative reading rebuilds sustained attention spans.</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">In-Person Family Snack</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Device-free meal conversation strengthens emotional resilience.</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2 rounded-md bg-purple-50 text-purple-600 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Creative Drawing or Music</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Active creation feels far more rewarding than passive scrolling.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
