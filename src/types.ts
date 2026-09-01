export type UserRole = 'parent' | 'kid' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  parentPhoneNumber: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  device: string;
  dailyTotalLimitMinutes: number; // e.g. 120 mins
  currentUsageTodayMinutes: number;
  isOnline: boolean;
  activeApp?: string;
  parentPhone: string;
}

export type SocialMediaPlatform = 
  | 'TikTok' 
  | 'Instagram' 
  | 'Snapchat' 
  | 'YouTube' 
  | 'Roblox' 
  | 'Discord' 
  | 'X (Twitter)' 
  | 'Pinterest';

export interface AppUsageDetail {
  platform: SocialMediaPlatform;
  timeSpentMinutes: number;
  limitMinutes: number;
  iconName: string;
  color: string;
  category: 'Video' | 'Photos & Stories' | 'Messaging' | 'Gaming & Social';
  riskLevel: 'Low' | 'Moderate' | 'High';
  breached: boolean;
}

export interface ActivityHistoryItem {
  id: string;
  childId: string;
  childName: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  platform: SocialMediaPlatform;
  durationMinutes: number;
  isLateNight: boolean; // after 9:30 PM
  limitExceeded: boolean;
  notificationSentToPhone?: string;
  notes?: string;
}

export interface ParentNotification {
  id: string;
  childId: string;
  childName: string;
  recipientPhone: string;
  platform: SocialMediaPlatform | 'All Apps';
  timeSpentMinutes: number;
  limitMinutes: number;
  timestamp: string; // ISO or formatted
  message: string;
  status: 'Delivered' | 'Simulated' | 'Read';
  severity: 'warning' | 'critical' | 'info';
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author: string;
  publishedDate: string;
  readTime: string;
  category: 'Mental Health' | 'Brain Science' | 'Legislation & Safety' | 'Parent Guide' | 'Tech Trends';
  imageUrl: string;
  keyTakeaways: string[];
  recommendedAgeFocus: string;
}

export interface ImpactTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  stat: string;
  statLabel: string;
  description: string;
  risks: string[];
  healthyTips: string[];
  scientificRef: string;
}
