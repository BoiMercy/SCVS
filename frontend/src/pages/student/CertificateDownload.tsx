import { useEffect, useState } from 'react';
import { Download, FileCheck, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

export default function CertificateDownload() {
  const [app, setApp] = useState<any>(null);
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/current').then(r => {
      setApp(r.data.application);
      if (r.data.application.status === 'cleared') {
        api.get(`/applications/${r.data.application.id}/certificate`).then(cr => {
          setCert(cr.data.certificate);
        }).catch(() => {});
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-surface-500">Loading...</div>;

  if (!app || app.status !== 'cleared') {
    return (
      <div className="max-w-xl mx-auto glass-card p-10 text-center mt-10">
        <ShieldAlert className="w-16 h-16 mx-auto text-warning-500 mb-4" />
        <h2 className="text-xl font-bold text-surface-900 mb-2">Certificate Not Ready</h2>
        <p className="text-surface-500 text-sm">You must complete all departmental clearances before your certificate is generated.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h1 className="text-2xl font-bold text-surface-900">Your Clearance Certificate</h1>
        <button onClick={handlePrint} className="inline-flex items-center gap-2 bg-primary-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-primary-700 transition text-sm shadow-lg shadow-primary-600/25">
          <Download className="w-4 h-4" /> Download / Print PDF
        </button>
      </div>

      <div className="glass-card p-12 bg-white text-surface-900 relative overflow-hidden print:shadow-none print:border-none print:p-0 border-8 border-double border-surface-200">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <FileCheck className="w-96 h-96" />
        </div>
        
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl font-serif font-bold text-primary-900">SCVS University</h1>
          <h2 className="text-xl font-serif mt-2 text-surface-600">Student Clearance Certificate</h2>
        </div>

        <div className="space-y-6 relative z-10 text-lg">
          <p>This is to certify that</p>
          <p className="text-2xl font-bold uppercase">{app.student?.first_name} {app.student?.last_name}</p>
          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <div><span className="font-semibold">Matric Number:</span> {app.student?.matric_number}</div>
            <div><span className="font-semibold">Session:</span> {app.session}</div>
            <div><span className="font-semibold">Faculty:</span> {app.student?.faculty}</div>
            <div><span className="font-semibold">Department:</span> {app.student?.department}</div>
          </div>
          <p className="mt-6 text-sm leading-relaxed">
            has successfully completed all required departmental clearance procedures and is hereby cleared of all institutional obligations as of <strong>{new Date(cert?.issued_at).toLocaleDateString()}</strong>.
          </p>
        </div>

        <div className="mt-16 flex justify-between items-end relative z-10">
          <div className="text-center">
            <div className="w-40 border-b border-surface-900 mb-2"></div>
            <p className="text-sm font-semibold">Authorized Signature</p>
          </div>
          
          <div className="text-right text-xs text-surface-500 font-mono space-y-1 bg-surface-50 p-4 rounded-lg border border-surface-200">
            <p className="font-bold text-surface-800 mb-2">Verification Details</p>
            <p>Code: {cert?.verification_code}</p>
            <p>Ref: {app.reference_number}</p>
            <p>Date: {new Date(cert?.issued_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
