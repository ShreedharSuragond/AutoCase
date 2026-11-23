import React from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import type { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 size={16} className="text-green" />;
      case 'WARNING':
      case 'ERROR':
        return <AlertCircle size={16} className="text-amber" />;
      default:
        return <Info size={16} className="text-primary" />;
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="notification-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-left">
            <Bell size={18} />
            <h3>Notification Center</h3>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">
          {notifications.length === 0 ? (
            <div className="drawer-empty-state">
              <Bell size={32} className="text-muted" />
              <p>No notifications at this time</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
                  onClick={() => !n.isRead && onMarkAsRead(n.id)}
                >
                  <div className="notification-icon-col">{getIcon(n.type)}</div>
                  <div className="notification-text-col">
                    <div className="notification-item-header">
                      <strong>{n.title}</strong>
                      {!n.isRead && <span className="unread-dot"></span>}
                    </div>
                    <p className="notification-message">{n.message}</p>
                    {n.link && (
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noreferrer"
                        className="notification-link"
                      >
                        <span>View MR / Repository</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
