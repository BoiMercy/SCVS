import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';

export default function ClearanceStatus() {
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/applications/current').then(r => setApp(r.data.application)).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-surface-400">Loading...</div>;
  if (!app) return <div className="text-center py-20 text-surface-500">No active application found.</div>;

  const approved = app.department_statuses?.filter((d: any) => d.status === 'approved').length || 0;
  const total = app.department_statuses?.length || 1;
  const pct = Math.round((approved / total) * 100);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-surface-900">Clearance Progress</h1>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-surface-600">{approved} of {total} departments approved</span>
          <span className="text-sm font-bold text-primary-600">{pct}%</span>
        </div>
        <div className="w-full bg-surface-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {app.department_statuses?.map((ds: any, i: number) => (
          <div key={ds.id} className="glass-card p-5 flex items-center justify-between animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center gap-4">
              {ds.status === 'approved' ? <CheckCircle className="w-6 h-6 text-success-500" /> : ds.status === 'rejected' ? <XCircle className="w-6 h-6 text-danger-500" /> : <Clock className="w-6 h-6 text-warning-500" />}
              <div>
                <p className="font-semibold text-surface-800">{ds.department?.name}</p>
                {ds.reviewed_by && <p className="text-xs text-surface-400 mt-0.5">Reviewed by {ds.reviewed_by.first_name} {ds.reviewed_by.last_name}</p>}
                {ds.rejection_reason && <p className="text-xs text-danger-600 mt-1">Reason: {ds.rejection_reason}</p>}
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${ds.status === 'approved' ? 'bg-success-50 text-success-600' : ds.status === 'rejected' ? 'bg-danger-50 text-danger-600' : 'bg-warning-50 text-warning-600'}`}>{ds.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
