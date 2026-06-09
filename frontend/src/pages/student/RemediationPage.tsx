import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

export default function RemediationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    // Fetch the specific department status to remediate
    // Assuming we can get current app and find it
    api.get('/applications/current').then(res => {
      const app = res.data.application;
      const ds = app.department_statuses?.find((d: any) => d.id === Number(id));
      if (ds) {
        setStatus(ds);
        setLabel(`${ds.department.name} Document Resubmission`);
      } else {
        navigate('/student/status');
      }
    });
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('label', label);

    try {
      await api.post(`/applications/${status.application_id}/remediate/${status.department_id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/student/status');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit remediation');
    } finally {
      setLoading(false);
    }
  };

  if (!status) return <div className="p-8 text-center text-surface-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link to="/student/status" className="inline-flex items-center gap-2 text-surface-500 hover:text-surface-800 mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Status
      </Link>

      <h1 className="text-2xl font-bold text-surface-900 mb-6">Fix Rejection: {status.department?.name}</h1>

      <div className="glass-card p-6 mb-6 border-l-4 border-danger-500">
        <h2 className="font-semibold text-danger-700">Rejection Reason</h2>
        <p className="text-sm text-surface-700 mt-2">{status.rejection_reason}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        {error && <div className="bg-danger-50 text-danger-600 text-sm p-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Document Label</label>
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Upload Corrected Document</label>
          <label className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-surface-300 rounded-xl hover:border-primary-400 cursor-pointer transition text-sm bg-surface-50">
            <Upload className="w-6 h-6 text-primary-500" />
            <span className="text-surface-600 font-medium">{file ? file.name : 'Click to select file'}</span>
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
          </label>
        </div>

        <button type="submit" disabled={loading || !file} className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-lg shadow-primary-600/25 text-sm">
          {loading ? 'Submitting...' : 'Resubmit Document'}
        </button>
      </form>
    </div>
  );
}
