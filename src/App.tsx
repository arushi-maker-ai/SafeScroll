/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NotificationToast } from './components/NotificationToast';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './views/HomeView';
import { HistoryView } from './views/HistoryView';
import { TimeLimitAlertsView } from './views/TimeLimitAlertsView';
import { NewsView } from './views/NewsView';
import { KidLiveTrackerView } from './views/KidLiveTrackerView';
import { DigitalWellnessTestView } from './views/DigitalWellnessTestView';
import { ShieldCheck, Heart, ExternalLink, PhoneCall, HelpCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, parentPhone } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'history':
        return <HistoryView />;
      case 'timelimits':
        return <TimeLimitAlertsView />;
      case 'news':
        return <NewsView />;
      case 'simulator':
        return <KidLiveTrackerView />;
      case 'assessment':
        return <DigitalWellnessTestView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Side Navigation Bar (Professional Polish Deep Navy) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header */}
        <Header setMobileOpen={setMobileMenuOpen} />

        {/* Dynamic View Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderActiveView()}
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 py-5 px-6 sm:px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                S
              </div>
              <span className="font-bold text-slate-800">ShieldKids Guardian v2.4</span>
              <span>— Parental Supervision & Under-18 Digital Safety System.</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
              <button
                onClick={() => setActiveTab('news')}
                className="hover:text-blue-600 transition-colors"
              >
                Research & News
              </button>
              <button
                onClick={() => setActiveTab('timelimits')}
                className="hover:text-blue-600 transition-colors"
              >
                SMS Alert Service ({parentPhone})
              </button>
              <button
                onClick={() => setActiveTab('assessment')}
                className="hover:text-blue-600 transition-colors"
              >
                Youth Wellness Assessment
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Interactive SMS Notification Popup Toast */}
      <NotificationToast />

      {/* Login / Sign in / Registration Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
