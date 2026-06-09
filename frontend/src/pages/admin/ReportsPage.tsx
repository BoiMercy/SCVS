import { useEffect, useState } from 'react';
import { Download, Filter, FileText } from 'lucide-react';
import api from '../../services/api';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', from: '', to: '' });

  const fetchReports = () => {
    setLoading(true);
    const params = new URLSearchParams(filters);
    api.get(`/admin/reports?${params.toString()}`).then(res => setReports(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, [filters.status]);

  const handleExportCSV = () => {
    if (reports.length === 0) return;
    
    const headers = ['Reference', 'Student', 'Matric Number', 'Faculty', 'Department', 'Session', 'Status', 'Submitted Date'];
    const rows = reports.map(r => [
      r.reference_number,
      `${r.student?.first_name} ${r.student?.last_name}`,
      r.student?.matric_number,
      r.student?.faculty,
      r.student?.department,
      r.session,
      r.status,
      new Date(r.submitted_at).toLocaleDateString()
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scvs_clearance_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Clearance Reports</h1>
          <p className="text-surface-500 mt-1">Generate and export system clearance data.</p>
        </div>
        <button onClick={handleExportCSV} disabled={reports.length === 0} className="inline-flex items-center gap-2 bg-primary-600 text-white font-medium px-4 py-2.5 rounded-xl hover:bg-primary-700 transition text-sm disabled:opacity-50">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-surface-800 flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4" /> Filter Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">Status</label>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white">
              <option value="">All Statuses</option>
              <option value="cleared">Cleared</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">From Date</label>
            <input type="date" value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">To Date</label>
            <input type="date" value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
          </div>
          <div>
            <button onClick={fetchReports} className="w-full py-2.5 bg-surface-100 text-surface-700 font-medium rounded-lg hover:bg-surface-200 transition text-sm">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-surface-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-surface-500">
            <FileText className="w-12 h-12 mx-auto text-surface-300 mb-3" />
            <p>No records found for the given criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-50 text-surface-600 font-medium border-b border-surface-200">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Session</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-50 transition">
                    <td className="px-6 py-4 font-mono font-medium text-surface-900">{r.reference_number}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-surface-900">{r.student?.first_name} {r.student?.last_name}</p>
                      <p className="text-xs text-surface-500">{r.student?.matric_number}</p>
                    </td>
                    <td className="px-6 py-4 text-surface-600">{r.session}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${r.status === 'cleared' ? 'bg-success-50 text-success-600' : r.status === 'rejected' ? 'bg-danger-50 text-danger-600' : 'bg-warning-50 text-warning-600'}`}>
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-surface-500">{new Date(r.submitted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
