import { useEffect, useState } from 'react';
import { Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-surface-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">System Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Applications', val: stats.total, icon: FileText, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Cleared', val: stats.cleared, icon: CheckCircle, color: 'text-success-600', bg: 'bg-success-50' },
          { label: 'Rejected', val: stats.rejected, icon: XCircle, color: 'text-danger-600', bg: 'bg-danger-50' },
          { label: 'In Progress', val: stats.pending, icon: Users, color: 'text-warning-600', bg: 'bg-warning-50' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.bg}`}>
              <s.icon className={`w-7 h-7 ${s.color}`} />
            </div>
            <div>
              <p className="text-surface-500 text-sm font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-surface-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-6">Department Clearance Statuses</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.departments} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="approved" name="Approved" stackId="a" fill="#10b981" radius={[0,0,4,4]} />
                <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#ef4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Recent Audit Activity</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {stats.recent.map((log: any) => (
              <div key={log.id} className="text-sm">
                <p className="text-surface-800"><span className="font-semibold">{log.user?.first_name || 'System'}</span> {log.description}</p>
                <p className="text-xs text-surface-400 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
