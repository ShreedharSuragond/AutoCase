export interface User {
  id: string;
  email: string;
  fullName: string;
  team: string;
  status: string;
  roles: string[];
  permissions: string[];
  lastLoginAt?: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalProjects: number;
  testsGenerated: number;
  successfulRuns: number;
  pendingReviews: number;
  recentProjects: RecentProject[];
  recentActivities: RecentActivity[];
}

export interface RecentProject {
  id?: string;
  name: string;
  ticketKey: string;
  timeAgo: string;
  status: 'Completed' | 'In Review' | 'Code Generated' | 'Analyzing';
  framework: string;
}

export interface RecentActivity {
  title: string;
  ticketKey: string;
  timeAgo: string;
  iconType: 'git' | 'code' | 'scenarios' | 'start' | 'alert';
  status: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  link?: string;
  createdAt: string;
}
