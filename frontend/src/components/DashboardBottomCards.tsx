import React from 'react';
import {
  FolderKanban,
  Code2,
  CheckCircle2,
  Hourglass,
  Folder,
  GitPullRequest,
  FileText,
  PlayCircle,
} from 'lucide-react';
import type { DashboardStats, RecentProject } from '../types';

interface DashboardBottomCardsProps {
  stats: DashboardStats;
  onOpenProject?: (project: RecentProject) => void;
  onViewAllProjects?: () => void;
  onViewAllActivity?: () => void;
}

export const DashboardBottomCards: React.FC<DashboardBottomCardsProps> = ({
  stats,
  onOpenProject,
  onViewAllProjects,
  onViewAllActivity,
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'badge-status-completed';
      case 'In Review':
        return 'badge-status-review';
      case 'Code Generated':
        return 'badge-status-generated';
      default:
        return 'badge-status-default';
    }
  };

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'git':
        return (
          <div className="activity-icon-circle bg-green-light text-green">
            <GitPullRequest size={14} />
          </div>
        );
      case 'code':
        return (
          <div className="activity-icon-circle bg-purple-light text-purple">
            <Code2 size={14} />
          </div>
        );
      case 'scenarios':
        return (
          <div className="activity-icon-circle bg-blue-light text-blue">
            <FileText size={14} />
          </div>
        );
      case 'start':
      default:
        return (
          <div className="activity-icon-circle bg-indigo-light text-indigo">
            <PlayCircle size={14} />
          </div>
        );
    }
  };

  return (
    <div className="dashboard-bottom-grid">
      {/* 1. Quick Stats Column */}
      <div className="dashboard-card quick-stats-card">
        <h3 className="card-title">Quick Stats</h3>
        <div className="stats-2x2-grid">
          <div className="stat-tile">
            <div className="stat-tile-left">
              <FolderKanban size={22} className="stat-icon text-indigo" />
            </div>
            <div className="stat-tile-right">
              <span className="stat-number">{stats.totalProjects}</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>

          <div className="stat-tile">
            <div className="stat-tile-left">
              <Code2 size={22} className="stat-icon text-blue" />
            </div>
            <div className="stat-tile-right">
              <span className="stat-number">{stats.testsGenerated}</span>
              <span className="stat-label">Tests Generated</span>
            </div>
          </div>

          <div className="stat-tile">
            <div className="stat-tile-left">
              <CheckCircle2 size={22} className="stat-icon text-green" />
            </div>
            <div className="stat-tile-right">
              <span className="stat-number">{stats.successfulRuns}</span>
              <span className="stat-label">Successful</span>
            </div>
          </div>

          <div className="stat-tile">
            <div className="stat-tile-left">
              <Hourglass size={22} className="stat-icon text-amber" />
            </div>
            <div className="stat-tile-right">
              <span className="stat-number">{stats.pendingReviews}</span>
              <span className="stat-label">Pending Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Recent Projects Column */}
      <div className="dashboard-card recent-projects-card">
        <div className="card-header-flex">
          <h3 className="card-title">Recent Projects</h3>
          <button className="card-header-action" onClick={onViewAllProjects}>
            View All
          </button>
        </div>

        <div className="projects-list">
          {stats.recentProjects.map((project, idx) => (
            <div
              key={idx}
              className="project-row-item"
              onClick={() => onOpenProject && onOpenProject(project)}
            >
              <div className="project-row-left">
                <div className="project-folder-icon">
                  <Folder size={18} />
                </div>
                <div className="project-details">
                  <span className="project-name">{project.name}</span>
                  <div className="project-meta">
                    <span className="project-ticket">{project.ticketKey}</span>
                    <span className="project-dot">•</span>
                    <span className="project-time">Updated {project.timeAgo}</span>
                  </div>
                </div>
              </div>

              <span className={`status-pill ${getStatusBadgeClass(project.status)}`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Activity Column */}
      <div className="dashboard-card recent-activity-card">
        <div className="card-header-flex">
          <h3 className="card-title">Recent Activity</h3>
          <button className="card-header-action" onClick={onViewAllActivity}>
            View All
          </button>
        </div>

        <div className="activity-timeline">
          {stats.recentActivities.map((act, idx) => (
            <div key={idx} className="activity-timeline-item">
              <div className="activity-timeline-left">
                {getActivityIcon(act.iconType)}
                {idx < stats.recentActivities.length - 1 && <div className="activity-line"></div>}
              </div>
              <div className="activity-timeline-content">
                <span className="activity-title">{act.title}</span>
                <div className="activity-meta">
                  <span className="activity-ticket">{act.ticketKey}</span>
                  <span className="activity-dot">•</span>
                  <span className="activity-time">{act.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
