import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

export default function ReviewHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/officer/history').then(res => {
      setHistory(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Review History</h1>
        <p className="text-surface-500 mt-1">Past clearance decisions</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-surface-500">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="glass-card p-12 text-center text-surface-500">
          No past reviews found.
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-50 text-surface-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Decision</th>
                  <th className="px-6 py-4">Date Reviewed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {history.map((s: any) => (
                  <tr key={s.id} className="hover:bg-surface-50 transition">
                    <td className="px-6 py-4 font-mono text-surface-900">{s.application.reference_number}</td>
                    <td className="px-6 py-4 font-medium">{s.application.student?.first_name} {s.application.student?.last_name}</td>
                    <td className="px-6 py-4">
                      {s.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-success-50 text-success-600 uppercase"><CheckCircle className="w-3.5 h-3.5" /> Approved</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-danger-50 text-danger-600 uppercase"><XCircle className="w-3.5 h-3.5" /> Rejected</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-surface-500">{new Date(s.reviewed_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
