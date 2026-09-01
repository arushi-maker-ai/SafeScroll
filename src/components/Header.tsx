import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Phone,
  ShieldCheck,
  User,
  AlertTriangle,
  PlayCircle,
  ExternalLink,
  Smartphone,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const {
    childrenList,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
    parentPhone,
    setActiveTab,
    setIsAuthModalOpen,
    currentUser,
    activeSession,
    triggerManualAlert,
  } = useApp();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalUsed = selectedChild.currentUsageTodayMinutes;
  const totalAllowed = selectedChild.dailyTotalLimitMinutes;
  const isBreached = totalUsed > totalAllowed;
  const percentUsed = Math.min(100, Math.round((totalUsed / totalAllowed) * 100));

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu + Child Selector */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-md text-slate-600 hover:text-blue-900 hover:bg-slate-100 transition-colors"
            title="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-sm sm:text-base font-semibold text-slate-700 hidden md:block">
            Parental Supervision Overview
          </h1>

          {/* Child Switcher Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 px-1.5 hidden sm:inline uppercase tracking-wider">
              Child:
            </span>
            {childrenList.map((child) => {
              const isSelected = child.id === selectedChildId;
              const hasAlert = child.currentUsageTodayMinutes > child.dailyTotalLimitMinutes;

              return (
                <button
                  key={child.id}
                  id={`child-pill-${child.id}`}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
                  }`}
                >
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{child.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden lg:inline">
                    ({child.age}y)
                  </span>
                  {hasAlert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Monitoring Pill, Phone Alert badge, SMS test, Notifications, Auth */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Monitoring Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold tracking-tight">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>ACTIVE MONITORING</span>
          </div>

          {/* Parent Phone Notification Chip */}
          <button
            onClick={() => setActiveTab('timelimits')}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
            title="Parent SMS Alert Recipient"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{parentPhone}</span>
          </button>

          {/* Live Kid Simulator Quick Launch */}
          <button
            id="header-live-sim-btn"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shadow-xs ${
              activeSession.isRunning
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {activeSession.isRunning ? 'Live Simulator Running' : 'Kid Simulator'}
            </span>
            <span className="sm:hidden">Sim</span>
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="header-notifications-bell"
              onClick={() => {
                setIsNotifDropdownOpen(!isNotifDropdownOpen);
                if (!isNotifDropdownOpen) {
                  markNotificationsAsRead();
                }
              }}
              className="relative p-1.5 rounded-md text-slate-600 hover:text-blue-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Parent SMS & Limit Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-800 text-sm">
                      SMS Alert Transmissions
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    To: {parentPhone}
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto py-2 space-y-1 divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">
                      No alerts recorded. Limits are currently compliant.
                    </p>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className="pt-2 first:pt-0 flex items-start gap-2.5 hover:bg-slate-50 p-1.5 rounded transition-colors"
                      >
                        <div
                          className={`p-1 rounded mt-0.5 shrink-0 ${
                            n.severity === 'critical'
                              ? 'bg-rose-100 text-rose-600'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-800 leading-snug font-medium line-clamp-2">
                            {n.message}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                            <span>{n.timestamp}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">
                              SMS Delivered
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setIsNotifDropdownOpen(false);
                      setActiveTab('timelimits');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Manage Alert Rules <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      markNotificationsAsRead();
                      setIsNotifDropdownOpen(false);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Switch Role Button */}
          <button
            id="header-user-profile-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-900 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-blue-900 font-bold text-xs">
              {currentUser.name[0]}
            </div>
            <span className="text-xs font-semibold hidden md:inline">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
