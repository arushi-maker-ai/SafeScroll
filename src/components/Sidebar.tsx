import React from 'react';
import {
  BookOpen,
  Clock,
  BellRing,
  Newspaper,
  PlayCircle,
  Brain,
  ShieldCheck,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useApp, ActiveTab } from '../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    currentUser,
    activeSession,
    setIsAuthModalOpen,
  } = useApp();

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    description: string;
  }[] = [
    {
      id: 'home',
      label: 'Impact & Insights',
      icon: BookOpen,
      description: 'Social media effects on youth',
    },
    {
      id: 'history',
      label: 'History & Usage',
      icon: Clock,
      description: 'Platform breakdown & logs',
    },
    {
      id: 'timelimits',
      label: 'Limits & SMS Alerts',
      icon: BellRing,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
      description: 'Parent phone alert rules',
    },
    {
      id: 'simulator',
      label: 'Live Kid Simulator',
      icon: PlayCircle,
      badge: activeSession.isRunning ? 'Active' : undefined,
      description: 'Real-time test & alert demo',
    },
    {
      id: 'news',
      label: 'Youth Impact News',
      icon: Newspaper,
      badge: 'New',
      description: 'Research & policy advisories',
    },
    {
      id: 'assessment',
      label: 'Wellness Assessment',
      icon: Brain,
      description: 'Risk score & healthy habits',
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 bg-blue-900 text-white border-r border-blue-800 flex flex-col transition-all duration-300 ease-in-out shadow-lg ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-blue-800">
          <div
            className={`flex items-center gap-2.5 overflow-hidden cursor-pointer ${
              collapsed ? 'justify-center w-full' : ''
            }`}
            onClick={() => handleNavClick('home')}
          >
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-blue-900 shrink-0 text-sm shadow-xs">
              S
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  ShieldKids
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-800 text-blue-200 font-semibold uppercase tracking-wider">
                    Guardian
                  </span>
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              id="sidebar-collapse-btn"
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex p-1 rounded-md text-blue-300 hover:text-white hover:bg-blue-800 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <div className="px-2 pb-1 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
            {!collapsed ? 'Supervision Navigation' : '•••'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-blue-800 text-white font-medium shadow-xs'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white font-normal'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? `${item.label} - ${item.description}` : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    isActive ? 'text-white opacity-100' : 'text-blue-200 opacity-75'
                  }`}
                />

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight shrink-0 ml-1 ${
                            isActive
                              ? 'bg-blue-400 text-blue-950'
                              : item.id === 'timelimits'
                              ? 'bg-rose-500 text-white animate-pulse'
                              : item.id === 'simulator' && activeSession.isRunning
                              ? 'bg-emerald-400 text-emerald-950 animate-pulse'
                              : 'bg-blue-800 text-blue-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Collapsed Badge indicator */}
                {collapsed && item.badge !== undefined && (
                  <span
                    className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ${
                      item.id === 'timelimits'
                        ? 'bg-rose-400 animate-ping'
                        : 'bg-blue-400'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Live Simulator Banner in Sidebar */}
        {!collapsed && (
          <div className="p-3 mx-3 mb-2 rounded-lg bg-blue-950/70 border border-blue-800 text-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Parent SMS Active</span>
            </div>
            <p className="text-[11px] text-blue-200 mt-1">
              Limits alert to: <span className="font-mono text-white font-semibold">{currentUser.parentPhoneNumber || '+1 (555) 012-3456'}</span>
            </p>
          </div>
        )}

        {/* User Account Footer Card */}
        <div className="p-3 border-t border-blue-800">
          {!collapsed ? (
            <div className="flex items-center gap-3 p-2 bg-blue-950 rounded-lg border border-blue-800/80">
              <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center font-bold text-blue-900 shrink-0 text-xs shadow-xs">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'JD'}
              </div>
              <div className="flex-1 overflow-hidden min-w-0">
                <p className="text-sm font-semibold truncate text-white">
                  {currentUser.name} ({currentUser.role === 'parent' ? 'Parent' : currentUser.role === 'kid' ? 'Teen' : 'Guest'})
                </p>
                <p className="text-xs opacity-70 truncate text-blue-200">
                  {currentUser.email}
                </p>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-[10px] px-2 py-1 bg-blue-800 hover:bg-blue-700 text-blue-100 rounded font-semibold transition-colors"
              >
                Switch
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex justify-center py-1"
              title={`Logged in as ${currentUser.name}`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center font-bold text-blue-900 text-xs">
                {currentUser.name[0]}
              </div>
            </button>
          )}

          {/* Expand button when collapsed */}
          {collapsed && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => setCollapsed(false)}
                className="p-1.5 rounded-md text-blue-300 hover:text-white hover:bg-blue-800 transition-colors"
                title="Expand sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
