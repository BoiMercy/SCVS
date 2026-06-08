import { useEffect, useState } from 'react';
import { ScrollText, ShieldAlert, Key, UserCheck, Settings } from 'lucide-react';
import api from '../../services/api';

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = (pageNum: number) => {
    setLoading(true);
    api.get(`/admin/audit-logs?page=${pageNum}`).then(res => {
      if (pageNum === 1) {
        setLogs(res.data.data);
      } else {
        setLogs(prev => [...prev, ...res.data.data]);
      }
      setHasMore(res.data.current_page < res.data.last_page);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(1); }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchLogs(next);
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('logout')) return <Key className="w-5 h-5 text-primary-500" />;
    if (action.includes('register') || action.includes('user')) return <UserCheck className="w-5 h-5 text-success-500" />;
    if (action.includes('reject') || action.includes('failed')) return <ShieldAlert className="w-5 h-5 text-danger-500" />;
    if (action.includes('system') || action.includes('admin')) return <Settings className="w-5 h-5 text-warning-500" />;
    return <ScrollText className="w-5 h-5 text-surface-400" />;
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">System Audit Logs</h1>
        <p className="text-surface-500 mt-1">Track all system events and user actions.</p>
      </div>

      <div className="glass-card overflow-hidden">
        {loading && page === 1 ? (
          <div className="p-8 text-center text-surface-500">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-surface-500">
            <ScrollText className="w-12 h-12 mx-auto text-surface-300 mb-3" />
            <p>No audit logs recorded yet.</p>
          </div>
        ) : (
          <div>
            <div className="divide-y divide-surface-200">
              {logs.map(log => (
                <div key={log.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-surface-50 transition">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-surface-100">
                      {getActionIcon(log.action)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-surface-900 text-sm">
                          {log.user ? `${log.user.first_name} ${log.user.last_name}` : 'System'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-200 text-surface-600">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-surface-600 mt-1">{log.description}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-xs text-surface-400 font-mono sm:pl-4">
                    <p>{new Date(log.created_at).toLocaleString()}</p>
                    {log.ip_address && <p className="mt-0.5">IP: {log.ip_address}</p>}
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="p-4 border-t border-surface-200 text-center bg-surface-50">
                <button onClick={loadMore} disabled={loading} className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition disabled:opacity-50">
                  {loading ? 'Loading...' : 'Load Older Logs'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
