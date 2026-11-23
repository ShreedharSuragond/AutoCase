import React, { useState } from 'react';
import { Search, Bell, HelpCircle, LogOut, LogIn, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopNavProps {
  onToggleNotifications: () => void;
  unreadNotificationsCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleNotifications,
  unreadNotificationsCount,
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'AS';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="app-topnav">
      <div className="search-bar-container">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search projects, tickets, or automations..."
          className="search-input"
        />
      </div>

      <div className="topnav-actions">
        <button
          className="icon-btn notification-btn"
          onClick={onToggleNotifications}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span className="notification-badge">{unreadNotificationsCount}</span>
          )}
        </button>

        <button className="icon-btn help-btn" aria-label="Help">
          <HelpCircle size={18} />
        </button>

        <div className="user-profile-relative">
          {user ? (
            <button
              className="user-profile-btn"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="user-avatar-circle">{getInitials(user.fullName)}</div>
              <span className="user-profile-name">{user.fullName}</span>
            </button>
          ) : (
            <button className="btn-secondary-sm" onClick={openAuthModal}>
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}

          {profileDropdownOpen && user && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-user-header">
                <strong>{user.fullName}</strong>
                <span className="dropdown-email">{user.email}</span>
                <span className="dropdown-team-badge">{user.team}</span>
                <span className="dropdown-role-chip">{user.roles[0]?.replace('ROLE_', '')}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  openAuthModal();
                }}
              >
                <UserIcon size={14} />
                <span>Switch Account</span>
              </button>
              <button
                className="dropdown-item text-danger"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
