import React from 'react';
import { Bell, CheckCheck, Clock, X, AlertCircle, CheckCircle2, Wrench, ShieldAlert } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking?: (bookingId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectBooking,
}) => {
  const { notifications, store, activeUser } = useStore();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'payment':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'approval':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <Wrench className="w-5 h-5 text-[#F04416]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-200 animate-slideLeft">
        {/* Header */}
        <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-50 rounded-xl text-[#F04416]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Notifications</h3>
              <p className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread update(s)` : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && activeUser && (
              <button
                onClick={() => store.markAllNotificationsRead(activeUser.id)}
                className="text-xs text-[#F04416] hover:underline flex items-center gap-1 font-semibold"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Read all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400 p-6">
              <Bell className="w-12 h-12 text-gray-200 mb-3 stroke-[1.5]" />
              <p className="font-semibold text-gray-700 text-sm">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">Updates regarding your roadside requests, providers and status will appear here.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  store.markNotificationRead(item.id);
                  if (item.referenceId && onSelectBooking) {
                    onSelectBooking(item.referenceId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  item.isRead
                    ? 'bg-white border-gray-100 hover:border-gray-200'
                    : 'bg-orange-50/50 border-orange-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-xs shrink-0 mt-0.5 border border-gray-100">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold truncate ${item.isRead ? 'text-gray-900' : 'text-[#F04416]'}`}>
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#F04416] shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-3">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-2 font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span>•</span>
                      {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 text-[11px] text-gray-500 text-center">
          RapidSeva Instant In-App & Push Notification Hub
        </div>
      </div>
    </div>
  );
};
