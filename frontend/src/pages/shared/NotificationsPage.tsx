import { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import api from '../../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    setLoading(true);
    api.get('/notifications').then(res => setNotifications(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markRead = async (id: number) => {
    await api.post(`/notifications/${id}/read`);
    fetchNotifs();
  };

  const markAllRead = async () => {
    await api.post(`/notifications/read-all`);
    fetchNotifs();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Notifications</h1>
        {notifications.some(n => !n.is_read) && (
          <button onClick={markAllRead} className="text-sm font-medium text-primary-600 hover:text-primary-700">Mark all as read</button>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-surface-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="glass-card p-12 text-center text-surface-500">
          <Bell className="w-12 h-12 mx-auto text-surface-300 mb-3" />
          <p>No notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className={`glass-card p-5 flex items-start gap-4 transition ${n.is_read ? 'opacity-70' : 'border-l-4 border-primary-500'}`}>
              <div className={`p-2 rounded-full mt-1 ${n.type === 'approval' || n.type === 'certificate_ready' ? 'bg-success-100 text-success-600' : n.type === 'rejection' ? 'bg-danger-100 text-danger-600' : 'bg-primary-100 text-primary-600'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-surface-900">{n.title}</h3>
                <p className="text-sm text-surface-600 mt-1 leading-relaxed">{n.message}</p>
                <p className="text-xs text-surface-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.is_read && (
                <button onClick={() => markRead(n.id)} className="p-2 text-surface-400 hover:text-primary-600 rounded-lg transition" title="Mark as read">
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
