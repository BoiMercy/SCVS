import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Check, ChevronDown } from 'lucide-react';
import api from '../services/api';

export default function VerifyPage() {
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleVerify = async () => {
    if (!verifyCode.trim()) return;
    setVerifyLoading(true);
    setVerifyResult(null);
    try {
      const res = await api.post('/verify', { code: verifyCode });
      setVerifyResult(res.data);
    } catch {
      setVerifyResult({ valid: false, message: 'Certificate not found or invalid code.' });
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-surface-500 hover:text-surface-900 transition font-medium mb-8">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-[2.5rem] p-10 sm:p-16 border border-surface-200 shadow-2xl shadow-surface-900/5 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-surface-900 mb-4">Verify Authenticity</h1>
          <p className="text-lg text-surface-500 mb-12 max-w-2xl mx-auto">Enter the unique Verification Code found at the bottom right of any SCVS clearance certificate to instantly confirm its validity.</p>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                value={verifyCode} 
                onChange={(e) => setVerifyCode(e.target.value)} 
                placeholder="e.g. SCVS-ABCD-1234"
                className="flex-1 px-6 py-4 rounded-2xl bg-surface-50 border-2 border-surface-200 text-surface-900 text-lg placeholder-surface-400 focus:outline-none focus:border-primary-500 transition shadow-inner" 
              />
              <button 
                onClick={handleVerify} 
                disabled={verifyLoading || !verifyCode}
                className="px-8 py-4 bg-primary-600 text-white font-bold text-lg rounded-2xl hover:bg-primary-500 disabled:opacity-50 disabled:hover:bg-primary-600 transition shadow-lg shadow-primary-600/20"
              >
                {verifyLoading ? 'Checking...' : 'Verify Now'}
              </button>
            </div>

            {verifyResult && (
              <div className={`mt-8 p-6 rounded-2xl text-left border animate-slide-in ${verifyResult.valid ? 'bg-success-50 border-success-200 text-success-800' : 'bg-danger-50 border-danger-200 text-danger-800'}`}>
                {verifyResult.valid ? (
                  <div className="flex gap-4 items-start">
                    <div className="mt-1 bg-success-500 rounded-full p-1"><Check className="w-5 h-5 text-white" /></div>
                    <div>
                      <p className="font-bold text-lg text-success-700 mb-2">Valid Authentic Certificate</p>
                      <p className="text-base mb-1 text-surface-700"><span className="opacity-60 text-surface-500">Student:</span> {verifyResult.student_name}</p>
                      <p className="text-base mb-1 text-surface-700"><span className="opacity-60 text-surface-500">Matric No:</span> {verifyResult.matric_number}</p>
                      <p className="text-base mb-1 text-surface-700"><span className="opacity-60 text-surface-500">Department:</span> {verifyResult.department} ({verifyResult.faculty})</p>
                      <p className="text-base text-surface-700"><span className="opacity-60 text-surface-500">Date Cleared:</span> {new Date(verifyResult.issued_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 items-center">
                    <div className="bg-danger-500 rounded-full p-1"><ChevronDown className="w-5 h-5 text-white" /></div>
                    <p className="font-bold text-lg">{verifyResult.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
