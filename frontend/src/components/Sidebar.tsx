import React, { useState } from 'react';
import {
  Home,
  PlusCircle,
  FolderKanban,
  GitBranch,
  History,
  BarChart2,
  Settings,
  ChevronDown,
  ChevronRight,
  Code2,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onCreateAutomation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onCreateAutomation }) => {
  const [integrationsOpen, setIntegrationsOpen] = useState(true);

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-container">
          <Code2 size={22} className="brand-icon" />
        </div>
        <span className="brand-name">AutoCase AI</span>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => onSelectTab('home')}
        >
          <Home size={18} className="nav-icon" />
          <span>Home</span>
        </button>

        <button
          className="nav-item create-automation-nav"
          onClick={onCreateAutomation}
        >
          <PlusCircle size={18} className="nav-icon text-accent" />
          <span>Create Automation</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'projects' ? 'active' : ''}`}
          onClick={() => onSelectTab('projects')}
        >
          <FolderKanban size={18} className="nav-icon" />
          <span>Projects</span>
        </button>

        <div className="nav-group">
          <button
            className="nav-item nav-group-header"
            onClick={() => setIntegrationsOpen(!integrationsOpen)}
          >
            <div className="nav-item-left">
              <GitBranch size={18} className="nav-icon" />
              <span>Integrations</span>
            </div>
            {integrationsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {integrationsOpen && (
            <div className="nav-subitems">
              <button
                className={`nav-subitem ${currentTab === 'integrations-jira' ? 'active' : ''}`}
                onClick={() => onSelectTab('integrations-jira')}
              >
                <span className="integration-icon jira-icon">◆</span>
                <span>Jira</span>
              </button>
              <button
                className={`nav-subitem ${currentTab === 'integrations-gitlab' ? 'active' : ''}`}
                onClick={() => onSelectTab('integrations-gitlab')}
              >
                <span className="integration-icon gitlab-icon">🦊</span>
                <span>GitLab</span>
              </button>
            </div>
          )}
        </div>

        <button
          className={`nav-item ${currentTab === 'history' ? 'active' : ''}`}
          onClick={() => onSelectTab('history')}
        >
          <History size={18} className="nav-icon" />
          <span>History</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'reports' ? 'active' : ''}`}
          onClick={() => onSelectTab('reports')}
        >
          <BarChart2 size={18} className="nav-icon" />
          <span>Reports</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`}
          onClick={() => onSelectTab('settings')}
        >
          <Settings size={18} className="nav-icon" />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-pill">
          <div className="user-avatar-sm">AS</div>
          <div className="user-info-sm">
            <span className="user-name-text">Jaya Sri</span>
            <span className="user-role-text">Core Workspace</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
