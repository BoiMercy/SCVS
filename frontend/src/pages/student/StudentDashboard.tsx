import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { FileText, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/current').then(r => setApp(r.data.application)).finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    pending: 'text-warning-600 bg-warning-50',
    in_review: 'text-primary-600 bg-primary-50',
    cleared: 'text-success-600 bg-success-50',
    rejected: 'text-danger-600 bg-danger-50',
    approved: 'text-success-600 bg-success-50',
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-surface-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Welcome, {user?.first_name}!</h1>
          <p className="text-surface-500 text-sm mt-1">{user?.matric_number} • {user?.faculty}, {user?.department}</p>
        </div>
        {!app && (
          <Link to="/student/apply" className="inline-flex items-center gap-2 bg-primary-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-primary-700 transition text-sm shadow-lg shadow-primary-600/25">
            <FileText className="w-4 h-4" /> Apply for Clearance
          </Link>
        )}
      </div>

      {app ? (
        <>
          {/* Overall Status */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900">Clearance Status</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[app.status] || ''}`}>{app.status}</span>
            </div>
            <p className="text-sm text-surface-500 mb-1">Reference: <span className="font-mono text-surface-700">{app.reference_number}</span></p>
            <p className="text-sm text-surface-500">Session: {app.session}</p>
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {app.department_statuses?.map((ds: any) => (
              <div key={ds.id} className={`glass-card p-5 border-l-4 ${ds.status === 'approved' ? 'border-success-500' : ds.status === 'rejected' ? 'border-danger-500' : 'border-warning-500'}`}>
                <h3 className="font-semibold text-surface-800 text-sm">{ds.department?.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {ds.status === 'approved' && <CheckCircle className="w-4 h-4 text-success-500" />}
                  {ds.status === 'rejected' && <XCircle className="w-4 h-4 text-danger-500" />}
                  {ds.status === 'pending' && <Clock className="w-4 h-4 text-warning-500" />}
                  <span className={`text-xs font-bold uppercase ${statusColors[ds.status]?.split(' ')[0]}`}>{ds.status}</span>
                </div>
                {ds.rejection_reason && <p className="mt-2 text-xs text-danger-600 bg-danger-50 p-2 rounded-lg">{ds.rejection_reason}</p>}
                {ds.status === 'rejected' && (
                  <Link to={`/student/remediate/${ds.id}`} className="inline-flex items-center gap-1 mt-3 text-xs text-primary-600 font-medium hover:underline">
                    Fix & Resubmit <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="glass-card p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-surface-300 mb-4" />
          <h2 className="text-xl font-semibold text-surface-700 mb-2">No Active Application</h2>
          <p className="text-surface-500 mb-6 text-sm">Start your clearance process by submitting an application.</p>
          <Link to="/student/apply" className="inline-flex items-center gap-2 bg-primary-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-700 transition text-sm">
            Apply Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
