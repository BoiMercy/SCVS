import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function ClearanceApplication() {
  const navigate = useNavigate();
  const [session, setSession] = useState('2025/2026');
  const [files, setFiles] = useState<{ file: File; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const labels = ['School Fees Receipt', 'Student ID Card', 'Faculty Slip', 'Departmental Approval', 'Hostel Clearance Proof', 'Passport Photograph'];

  const addFile = (file: File, label: string) => setFiles([...files, { file, label }]);
  const removeFile = (i: number) => setFiles(files.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/applications', { session });
      const appId = res.data.application.id;

      if (files.length > 0) {
        const fd = new FormData();
        files.forEach((f, i) => {
          fd.append(`files[${i}][file]`, f.file);
          fd.append(`files[${i}][label]`, f.label);
        });
        await api.post(`/applications/${appId}/attachments`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Apply for Clearance</h1>

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        {error && <div className="bg-danger-50 text-danger-600 text-sm p-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Academic Session</label>
          <select value={session} onChange={(e) => setSession(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white">
            <option>2025/2026</option><option>2024/2025</option><option>2023/2024</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-3">Upload Documents (Optional at this stage)</label>
          <div className="grid grid-cols-2 gap-3">
            {labels.map((label) => (
              <label key={label} className="flex items-center gap-2 p-3 border-2 border-dashed border-surface-300 rounded-xl hover:border-primary-400 cursor-pointer transition text-sm">
                <Upload className="w-4 h-4 text-surface-400 shrink-0" />
                <span className="text-surface-600 truncate">{label}</span>
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => { if (e.target.files?.[0]) addFile(e.target.files[0], label); }} />
              </label>
            ))}
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-surface-700">Attached Files ({files.length})</p>
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-surface-50 px-4 py-2 rounded-lg text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="truncate">{f.label}: {f.file.name}</span>
                </div>
                <button type="button" onClick={() => removeFile(i)} className="text-danger-500 hover:text-danger-700 shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-lg shadow-primary-600/25 text-sm">
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
