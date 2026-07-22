import { useEffect, useRef } from 'react';
import { Bell, Bot, Truck, CheckCircle, ThumbsUp, AlertCircle, X } from 'lucide-react';
import { getStoredNotifications, setStoredNotifications } from '@/lib/store';
import { Notification } from '@/types';
import { formatDistanceToNow } from '@/lib/utils';

interface Props {
  onClose: () => void;
}

const iconMap: Record<Notification['type'], React.ElementType> = {
  ai:       Bot,
  dispatch: Truck,
  resolved: CheckCircle,
  upvote:   ThumbsUp,
  status:   AlertCircle,
};

const colorMap: Record<Notification['type'], string> = {
  ai:       'text-emerald-600 bg-emerald-50',
  dispatch: 'text-blue-600 bg-blue-50',
  resolved: 'text-green-600 bg-green-50',
  upvote:   'text-amber-600 bg-amber-50',
  status:   'text-purple-600 bg-purple-50',
};

export default function NotificationPanel({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const notifications = getStoredNotifications();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setStoredNotifications(updated);
    onClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div ref={ref} className="absolute right-0 top-12 w-80 bg-white border border-border rounded-2xl shadow-2xl z-50 overflow-hidden slide-in-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[hsl(158,64%,32%)]" />
          <span className="font-bold text-sm text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-[hsl(158,64%,32%)] font-medium hover:underline">
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[340px] overflow-y-auto divide-y divide-border/60">
        {notifications.length === 0 ? (
          <div className="py-10 text-center">
            <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          notifications.map(notif => {
            const Icon = iconMap[notif.type] || Bell;
            const colorClass = colorMap[notif.type] || 'text-gray-600 bg-gray-50';
            return (
              <div key={notif.id} className={`px-4 py-3 hover:bg-muted/30 transition-colors ${!notif.read ? 'bg-emerald-50/60' : ''}`}>
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground leading-tight">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{formatDistanceToNow(notif.createdAt)}</p>
                  </div>
                  {!notif.read && <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
