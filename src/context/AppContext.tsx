import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ChildProfile,
  AppUsageDetail,
  ActivityHistoryItem,
  ParentNotification,
  SocialMediaPlatform,
} from '../types';
import {
  INITIAL_CHILDREN,
  INITIAL_APP_USAGES,
  INITIAL_ACTIVITY_HISTORY,
  INITIAL_NOTIFICATIONS,
} from '../data/defaultData';

export type ActiveTab = 'home' | 'history' | 'timelimits' | 'news' | 'simulator' | 'assessment';

interface ActiveSession {
  isRunning: boolean;
  platform: SocialMediaPlatform;
  childId: string;
  elapsedMinutes: number;
  speedMultiplier: number; // 1x or 10x for quick testing
  startedAt: Date;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  childrenList: ChildProfile[];
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  selectedChild: ChildProfile;
  appUsages: Record<string, AppUsageDetail[]>;
  updateAppLimit: (childId: string, platform: SocialMediaPlatform, newLimitMinutes: number) => void;
  updateTotalDailyLimit: (childId: string, newTotalMinutes: number) => void;
  activityHistory: ActivityHistoryItem[];
  addActivityRecord: (record: Omit<ActivityHistoryItem, 'id'>) => void;
  notifications: ParentNotification[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  parentPhone: string;
  setParentPhone: (phone: string) => void;
  triggerManualAlert: (platform: SocialMediaPlatform, customTime?: number) => void;
  activeToast: ParentNotification | null;
  dismissToast: () => void;
  // Live Session Simulator
  activeSession: ActiveSession;
  startLiveSession: (platform: SocialMediaPlatform, speed?: number) => void;
  stopLiveSession: () => void;
  tickSessionTime: (addedMinutes: number) => void;
  // Auth state
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  switchRole: (role: 'parent' | 'kid' | 'guest') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'safescroll_app_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-parent-1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@example.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    parentPhoneNumber: '+1 (555) 382-9912',
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(INITIAL_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<string>('child-1');
  const [appUsages, setAppUsages] = useState<Record<string, AppUsageDetail[]>>(INITIAL_APP_USAGES);
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>(INITIAL_ACTIVITY_HISTORY);
  const [notifications, setNotifications] = useState<ParentNotification[]>(INITIAL_NOTIFICATIONS);
  const [parentPhone, setParentPhone] = useState<string>('+1 (555) 382-9912');
  const [activeToast, setActiveToast] = useState<ParentNotification | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Live Simulator state
  const [activeSession, setActiveSession] = useState<ActiveSession>({
    isRunning: false,
    platform: 'TikTok',
    childId: 'child-1',
    elapsedMinutes: 0,
    speedMultiplier: 5,
    startedAt: new Date(),
  });

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.childrenList) setChildrenList(parsed.childrenList);
        if (parsed.appUsages) setAppUsages(parsed.appUsages);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.activityHistory) setActivityHistory(parsed.activityHistory);
        if (parsed.parentPhone) setParentPhone(parsed.parentPhone);
      }
    } catch {
      // fallback to initial
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          childrenList,
          appUsages,
          notifications,
          activityHistory,
          parentPhone,
        })
      );
    } catch {
      // storage quota or error
    }
  }, [childrenList, appUsages, notifications, activityHistory, parentPhone]);

  // Selected Child helper
  const selectedChild =
    childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

  const updateAppLimit = (childId: string, platform: SocialMediaPlatform, newLimitMinutes: number) => {
    setAppUsages((prev) => {
      const currentList = prev[childId] || [];
      const updated = currentList.map((item) => {
        if (item.platform === platform) {
          const breached = item.timeSpentMinutes > newLimitMinutes;
          return { ...item, limitMinutes: newLimitMinutes, breached };
        }
        return item;
      });
      return { ...prev, [childId]: updated };
    });
  };

  const updateTotalDailyLimit = (childId: string, newTotalMinutes: number) => {
    setChildrenList((prev) =>
      prev.map((c) =>
        c.id === childId ? { ...c, dailyTotalLimitMinutes: newTotalMinutes } : c
      )
    );
  };

  const addActivityRecord = (record: Omit<ActivityHistoryItem, 'id'>) => {
    const newRecord: ActivityHistoryItem = {
      ...record,
      id: `act-${Date.now()}`,
    };
    setActivityHistory((prev) => [newRecord, ...prev]);
  };

  const unreadNotificationCount = notifications.filter(
    (n) => n.status !== 'Read'
  ).length;

  const markNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: 'Read' }))
    );
  };

  const fireParentAlert = (
    child: ChildProfile,
    platform: SocialMediaPlatform | 'All Apps',
    timeSpent: number,
    limit: number,
    customMsg?: string
  ) => {
    const formattedTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const message =
      customMsg ||
      `⚠️ SafeScroll Parent Alert: ${child.name} has spent ${timeSpent} mins on ${platform}, exceeding the allowed ${limit} mins limit! Notification dispatched to ${parentPhone}.`;

    const newNotif: ParentNotification = {
      id: `notif-${Date.now()}`,
      childId: child.id,
      childName: child.name,
      recipientPhone: parentPhone,
      platform,
      timeSpentMinutes: timeSpent,
      limitMinutes: limit,
      timestamp: `Today at ${formattedTime}`,
      message,
      status: 'Delivered',
      severity: timeSpent > limit * 1.3 ? 'critical' : 'warning',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToast(newNotif);

    // Audio chime simulation
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch {
      // audio context blocked or unsupported
    }
  };

  const triggerManualAlert = (platform: SocialMediaPlatform, customTime = 55) => {
    const child = selectedChild;
    const appList = appUsages[child.id] || [];
    const app = appList.find((a) => a.platform === platform);
    const limit = app ? app.limitMinutes : 30;

    fireParentAlert(child, platform, customTime, limit);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  // Live session simulator timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeSession.isRunning) {
      interval = setInterval(() => {
        setActiveSession((prev) => {
          if (!prev.isRunning) return prev;
          const nextMinutes = prev.elapsedMinutes + (1 * prev.speedMultiplier);
          
          // Check limits
          const child = childrenList.find((c) => c.id === prev.childId) || childrenList[0];
          const appList = appUsages[child.id] || [];
          const app = appList.find((a) => a.platform === prev.platform);
          const limit = app ? app.limitMinutes : 30;

          // Trigger alert if we just crossed limit or 10m over limit
          if (nextMinutes >= limit && prev.elapsedMinutes < limit) {
            fireParentAlert(
              child,
              prev.platform,
              nextMinutes,
              limit,
              `🚨 SafeScroll Real-time Limit Breach: ${child.name} has just exceeded their ${limit}m limit on ${prev.platform} (Current: ${nextMinutes}m)! SMS sent to parent phone: ${parentPhone}.`
            );
          }

          return {
            ...prev,
            elapsedMinutes: nextMinutes,
          };
        });
      }, 1500); // every 1.5s adds simulated minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession.isRunning, activeSession.speedMultiplier, parentPhone, childrenList, appUsages]);

  const startLiveSession = (platform: SocialMediaPlatform, speed = 5) => {
    setActiveSession({
      isRunning: true,
      platform,
      childId: selectedChildId,
      elapsedMinutes: 0,
      speedMultiplier: speed,
      startedAt: new Date(),
    });
  };

  const stopLiveSession = () => {
    if (activeSession.isRunning && activeSession.elapsedMinutes > 0) {
      const child = selectedChild;
      const appList = appUsages[child.id] || [];
      const app = appList.find((a) => a.platform === activeSession.platform);
      const limit = app ? app.limitMinutes : 30;
      const breached = activeSession.elapsedMinutes > limit;

      addActivityRecord({
        childId: child.id,
        childName: child.name,
        date: new Date().toISOString().split('T')[0],
        startTime: activeSession.startedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        platform: activeSession.platform,
        durationMinutes: activeSession.elapsedMinutes,
        isLateNight: new Date().getHours() >= 21,
        limitExceeded: breached,
        notificationSentToPhone: breached ? parentPhone : undefined,
        notes: breached
          ? `Live session exceeded allowed limit. Automatic SMS alert logged.`
          : `Healthy mindful session recorded.`,
      });

      // Update child current total
      setChildrenList((prev) =>
        prev.map((c) =>
          c.id === child.id
            ? { ...c, currentUsageTodayMinutes: c.currentUsageTodayMinutes + activeSession.elapsedMinutes }
            : c
        )
      );

      // Update app usage
      setAppUsages((prev) => {
        const list = prev[child.id] || [];
        const existing = list.find((a) => a.platform === activeSession.platform);
        if (existing) {
          const updated = list.map((a) =>
            a.platform === activeSession.platform
              ? {
                  ...a,
                  timeSpentMinutes: a.timeSpentMinutes + activeSession.elapsedMinutes,
                  breached: a.timeSpentMinutes + activeSession.elapsedMinutes > a.limitMinutes,
                }
              : a
          );
          return { ...prev, [child.id]: updated };
        } else {
          return {
            ...prev,
            [child.id]: [
              ...list,
              {
                platform: activeSession.platform,
                timeSpentMinutes: activeSession.elapsedMinutes,
                limitMinutes: limit,
                iconName: 'Smartphone',
                color: '#3B82F6',
                category: 'Video',
                riskLevel: 'Moderate',
                breached,
              },
            ],
          };
        }
      });
    }

    setActiveSession((prev) => ({ ...prev, isRunning: false }));
  };

  const tickSessionTime = (addedMinutes: number) => {
    setActiveSession((prev) => ({
      ...prev,
      elapsedMinutes: Math.max(0, prev.elapsedMinutes + addedMinutes),
    }));
  };

  const switchRole = (role: 'parent' | 'kid' | 'guest') => {
    if (role === 'kid') {
      setCurrentUser({
        id: 'user-kid-1',
        name: 'Leo Mitchell (Teen)',
        email: 'leo.mitchell@student.edu',
        role: 'kid',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        parentPhoneNumber: parentPhone,
      });
      setSelectedChildId('child-1');
    } else if (role === 'parent') {
      setCurrentUser({
        id: 'user-parent-1',
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@example.com',
        role: 'parent',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        parentPhoneNumber: parentPhone,
      });
    } else {
      setCurrentUser({
        id: 'user-guest-1',
        name: 'Guest Educator',
        email: 'guest@safescroll.org',
        role: 'guest',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        parentPhoneNumber: parentPhone,
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        childrenList,
        selectedChildId,
        setSelectedChildId,
        selectedChild,
        appUsages,
        updateAppLimit,
        updateTotalDailyLimit,
        activityHistory,
        addActivityRecord,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        parentPhone,
        setParentPhone,
        triggerManualAlert,
        activeToast,
        dismissToast,
        activeSession,
        startLiveSession,
        stopLiveSession,
        tickSessionTime,
        isAuthModalOpen,
        setIsAuthModalOpen,
        switchRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
