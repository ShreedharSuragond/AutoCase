import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { HeroBanner } from './components/HeroBanner';
import { InstructionSourceSelector } from './components/InstructionSourceSelector';
import { HowItWorksFlow } from './components/HowItWorksFlow';
import { DashboardBottomCards } from './components/DashboardBottomCards';
import { AutomationWizardModal } from './components/AutomationWizardModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import type { DashboardStats, AppNotification, RecentProject } from './types';
import './App.css';

const initialEmptyStats: DashboardStats = {
  totalProjects: 0,
  testsGenerated: 0,
  successfulRuns: 0,
  pendingReviews: 0,
  recentProjects: [],
  recentActivities: [],
};

const ProtectedDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedSources, setSelectedSources] = useState<string[]>(['jira', 'screenshot']);
  const [stats, setStats] = useState<DashboardStats>(initialEmptyStats);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      // Load real statistics and recent records directly from PostgreSQL
      const res = await fetch('/api/dashboard/stats', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard stats from DB:', err);
    }

    try {
      // Load real notifications from PostgreSQL
      const resNotif = await fetch('/api/notifications', { credentials: 'include' });
      if (resNotif.ok) {
        const jsonNotif = await resNotif.json();
        if (jsonNotif.success && jsonNotif.data) {
          setNotifications(jsonNotif.data);
        }
      }
    } catch (err) {
      console.error('Failed to load notifications from DB:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]
    );
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="app-layout">
      {/* 1. Dark Navy Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onCreateAutomation={() => setIsWizardOpen(true)}
      />

      {/* 2. Main Canvas Area */}
      <div className="app-main-canvas">
        <TopNav
          onToggleNotifications={() => setIsNotificationDrawerOpen(!isNotificationDrawerOpen)}
          unreadNotificationsCount={unreadCount}
        />

        <main className="app-body-container">
          {currentTab === 'home' && (
            <div className="dashboard-scrollable-content">
              {/* Hero Banner */}
              <HeroBanner />

              {/* Get Started / Source Selection */}
              <InstructionSourceSelector
                selectedSources={selectedSources}
                onToggleSource={handleToggleSource}
                onCreateAutomation={() => setIsWizardOpen(true)}
              />

              {/* How It Works Flow */}
              <HowItWorksFlow />

              {/* Quick Stats, Recent Projects, Recent Activity (Loaded from PostgreSQL) */}
              {isDataLoading ? (
                <div className="loading-data-card">
                  <div className="spinner"></div>
                  <span>Loading workspace analytics from database...</span>
                </div>
              ) : (
                <DashboardBottomCards
                  stats={stats}
                  onOpenProject={(proj: RecentProject) => {
                    console.log('Opened project from DB:', proj);
                    setIsWizardOpen(true);
                  }}
                  onViewAllProjects={() => setCurrentTab('projects')}
                  onViewAllActivity={() => setIsNotificationDrawerOpen(true)}
                />
              )}
            </div>
          )}

          {currentTab === 'projects' && (
            <div className="tab-placeholder-view">
              <h2>All Automation Projects (Database)</h2>
              <p>Active repositories retrieved from PostgreSQL:</p>
              <div className="projects-grid-view">
                {stats.recentProjects.map((p, idx) => (
                  <div key={idx} className="placeholder-card">
                    <span className="badge-status-completed">{p.status}</span>
                    <h3>{p.name}</h3>
                    <p>Key: <strong>{p.ticketKey}</strong> | Framework: {p.framework}</p>
                    <button className="btn-primary-sm" onClick={() => setIsWizardOpen(true)}>
                      Open Automation
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab.startsWith('integrations') && (
            <div className="tab-placeholder-view">
              <h2>Connected Integrations</h2>
              <p>Jira Cloud and GitLab REST connectors linked to user: <strong>{user?.email}</strong></p>
              <div className="placeholder-card">
                <span className="badge-status-completed">Active</span>
                <h3>Jira Cloud & GitLab CI/CD</h3>
                <p>Status: Authenticated session via JWT Cookie</p>
              </div>
            </div>
          )}

          {currentTab === 'history' && (
            <div className="tab-placeholder-view">
              <h2>Generation History & Audit Logs</h2>
              <p>Trace log events recorded directly in PostgreSQL:</p>
              <div className="audit-table-simple">
                {stats.recentActivities.map((act, i) => (
                  <div key={i} className="audit-row">
                    <span className="audit-time">{act.timeAgo}</span>
                    <strong className="audit-title">{act.title}</strong>
                    <span className="audit-status">{act.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'reports' && (
            <div className="tab-placeholder-view">
              <h2>Analytics & Metrics (PostgreSQL Aggregates)</h2>
              <p>Calculated directly across {stats.totalProjects} projects and {stats.testsGenerated} generated test scenarios.</p>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="tab-placeholder-view">
              <h2>Platform & RBAC Settings</h2>
              <p>Signed in as: <strong>{user?.fullName}</strong> ({user?.email})</p>
              <p>Team: <strong>{user?.team}</strong> | Role: <strong>{user?.roles?.join(', ')}</strong></p>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AutomationWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  // 1. Session verification in progress
  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner"></div>
        <h2>AutoCase AI</h2>
        <p>Verifying secure session...</p>
      </div>
    );
  }

  // 2. Unauthenticated: Strictly require login/account creation. NOTHING on the dashboard is accessible.
  if (!user) {
    return <AuthPage />;
  }

  // 3. Authenticated: Render protected dashboard with database data
  return <ProtectedDashboard />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
