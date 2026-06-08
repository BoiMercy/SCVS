import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { initializeCsrfToken } from '../../services/authService';

export default function LoginPage() {
  const { login, error, clearError, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await initializeCsrfToken();
      await login(form);
      const user = useAuthStore.getState().user;
      if (user?.role.name === 'student') navigate('/student/dashboard');
      else if (user?.role.name === 'super_admin') navigate('/admin/dashboard');
      else navigate('/officer/dashboard');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/university.jpg')] bg-cover bg-center px-4 relative">
      <div className="absolute inset-0 bg-primary-900/70 backdrop-blur-sm"></div>
      <div className="w-full max-w-xl animate-fade-in relative z-10">
        <Link to="/" className="absolute -top-12 left-0 inline-flex items-center gap-2 text-white/80 hover:text-white transition text-base font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-primary-100 mt-2 text-base">Sign in to your SCVS account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 shadow-xl space-y-5">
          {error && <div className="bg-danger-50 text-danger-600 text-sm p-3 rounded-lg">{error}</div>}

          <div>
            <label className="block text-base font-medium text-surface-700 mb-2">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full px-5 py-3.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-base" placeholder="your@email.com" />
          </div>

          <div>
            <label className="block text-base font-medium text-surface-700 mb-2">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                className="w-full px-5 py-3.5 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-base pr-12" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-lg shadow-primary-600/25 text-base">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-base text-surface-500">
            Don't have an account? <Link to="/register" className="text-primary-600 font-medium hover:underline">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
