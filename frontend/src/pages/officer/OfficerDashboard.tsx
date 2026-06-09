import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

export default function OfficerDashboard() {
  const { user } = useAuthStore();
  const [queue, setQueue] = useState<any[]>([]);
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQueue = () => {
    setLoading(true);
    api.get('/officer/queue').then(res => {
      setDepartment(res.data.department);
      setQueue(res.data.queue.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchQueue(); }, []);

  const handleApprove = async (statusId: number) => {
    if (!confirm('Are you sure you want to approve this application?')) return;
    setActionLoading(true);
    try {
      await api.post(`/officer/reviews/${statusId}/approve`);
      setSelectedStatus(null);
      fetchQueue();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (statusId: number) => {
    if (!rejectionReason.trim() || rejectionReason.length < 10) {
      alert('Please provide a detailed rejection reason (min 10 chars).');
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/officer/reviews/${statusId}/reject`, { rejection_reason: rejectionReason });
      setSelectedStatus(null);
      setRejectionReason('');
      fetchQueue();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Review Queue</h1>
        <p className="text-surface-500 mt-1">{department?.name} Department — Pending Approvals</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-surface-500">Loading queue...</div>
      ) : queue.length === 0 ? (
        <div className="glass-card p-12 text-center text-surface-500">
          <CheckCircle className="w-12 h-12 mx-auto text-success-500 mb-3" />
          <p>No pending applications to review.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-50 text-surface-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Matric No.</th>
                  <th className="px-6 py-4">Session</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {queue.map((s: any) => (
                  <tr key={s.id} className="hover:bg-surface-50 transition">
                    <td className="px-6 py-4 font-mono text-surface-900">{s.application.reference_number}</td>
                    <td className="px-6 py-4 font-medium">{s.application.student?.first_name} {s.application.student?.last_name}</td>
                    <td className="px-6 py-4 text-surface-600">{s.application.student?.matric_number}</td>
                    <td className="px-6 py-4 text-surface-600">{s.application.session}</td>
                    <td className="px-6 py-4 text-surface-500">{new Date(s.application.submitted_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedStatus(s)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition font-medium">
                        <Eye className="w-4 h-4" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-surface-200 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <h2 className="text-xl font-bold text-surface-900">Review Application</h2>
              <button onClick={() => { setSelectedStatus(null); setRejectionReason(''); }} className="text-surface-400 hover:text-surface-700">✕</button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Student Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><p className="text-xs text-surface-500 mb-1">Name</p><p className="font-semibold text-sm">{selectedStatus.application.student?.first_name} {selectedStatus.application.student?.last_name}</p></div>
                <div><p className="text-xs text-surface-500 mb-1">Matric Number</p><p className="font-semibold text-sm">{selectedStatus.application.student?.matric_number}</p></div>
                <div><p className="text-xs text-surface-500 mb-1">Faculty</p><p className="font-semibold text-sm">{selectedStatus.application.student?.faculty}</p></div>
                <div><p className="text-xs text-surface-500 mb-1">Department</p><p className="font-semibold text-sm">{selectedStatus.application.student?.department}</p></div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="font-semibold text-surface-800 mb-3 text-sm">Uploaded Documents</h3>
                {selectedStatus.application.attachments?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedStatus.application.attachments.map((a: any) => (
                      <div key={a.id} className="flex items-center justify-between bg-surface-50 p-3 rounded-xl border border-surface-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm"><FileCheck className="w-5 h-5 text-primary-500" /></div>
                          <div>
                            <p className="font-medium text-sm text-surface-900">{a.label}</p>
                            <p className="text-xs text-surface-500">{a.original_filename} • {a.is_resubmission && <span className="text-warning-600 font-bold">Resubmission</span>}</p>
                          </div>
                        </div>
                        <a href={`${import.meta.env.VITE_API_URL?.replace('/api/v1','')}/storage/${a.stored_path}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition">View File</a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-surface-500 italic">No documents uploaded for this department.</p>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-surface-200 pt-6">
                <h3 className="font-semibold text-surface-800 mb-4 text-sm">Decision</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1">Rejection Reason (only if rejecting)</label>
                    <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} placeholder="Provide details for rejection..." className="w-full px-4 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"></textarea>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => handleReject(selectedStatus.id)} disabled={actionLoading} className="px-6 py-2.5 bg-danger-50 text-danger-700 font-medium rounded-xl hover:bg-danger-100 transition disabled:opacity-50">
                      <XCircle className="w-4 h-4 inline mr-2" /> Reject
                    </button>
                    <button onClick={() => handleApprove(selectedStatus.id)} disabled={actionLoading} className="px-6 py-2.5 bg-success-600 text-white font-medium rounded-xl hover:bg-success-700 transition shadow-lg shadow-success-600/20 disabled:opacity-50">
                      <CheckCircle className="w-4 h-4 inline mr-2" /> Approve
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
