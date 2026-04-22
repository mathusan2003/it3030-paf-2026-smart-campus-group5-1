import { useEffect, useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { getNotifications, markNotificationRead } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ApiNotification {
  id: string;
  title: string;
  message: string;
  relatedType?: string;
  read: boolean;
  createdAt?: string;
}

function mapType(t?: string): 'info' | 'success' | 'warning' | 'error' {
  const u = (t || '').toUpperCase();
  if (u.includes('BOOKING')) return 'success';
  if (u.includes('TICKET')) return 'info';
  return 'info';
}

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getNotifications(user.id);
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Could not load notifications.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to update notification');
    }
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    try {
      await Promise.all(unread.map((n) => markNotificationRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Could not mark all as read');
    }
  };

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (n: ApiNotification) => {
    const type = mapType(n.relatedType);
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#10B981]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />;
      case 'error':
        return <X className="w-5 h-5 text-[#EF4444]" />;
      default:
        return <Info className="w-5 h-5 text-[#3B82F6]" />;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#374151] mb-2 flex items-center">
            <Bell className="w-6 h-6 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 px-2 py-1 bg-[#1D4ED8] text-white text-xs rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-[#9CA3AF]">From Spring Boot /api/notifications?userId=…</p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => handleMarkAllAsRead()}
            className="bg-[#1D4ED8] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition-colors"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#1D4ED8] text-white'
                : 'bg-[#F3F4F6] text-[#9CA3AF] hover:bg-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-[#1D4ED8] text-white'
                : 'bg-[#F3F4F6] text-[#9CA3AF] hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-[#9CA3AF]">Loading…</p>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#374151] mb-2">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 ${
                mapType(notification.relatedType) === 'success'
                  ? 'border-l-[#10B981]'
                  : 'border-l-[#3B82F6]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getIcon(notification)}
                  <h3
                    className={`font-semibold ${
                      notification.read ? 'text-[#9CA3AF]' : 'text-[#374151]'
                    }`}
                  >
                    {notification.title}
                  </h3>
                  {!notification.read && <div className="w-2 h-2 bg-[#1D4ED8] rounded-full" />}
                </div>
                <button
                  type="button"
                  onClick={() => handleDismiss(notification.id)}
                  className="text-[#9CA3AF] hover:text-[#374151] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p
                className={`text-sm mb-4 ${
                  notification.read ? 'text-[#9CA3AF]' : 'text-[#374151]'
                }`}
              >
                {notification.message}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9CA3AF]">
                  {notification.createdAt
                    ? format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')
                    : ''}
                </span>
                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-xs text-[#1D4ED8] hover:text-[#1E40AF] font-medium transition-colors"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}