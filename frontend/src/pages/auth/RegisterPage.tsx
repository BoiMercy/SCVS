import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Shield, ArrowLeft } from 'lucide-react';
import { initializeCsrfToken } from '../../services/authService';

const faculties = ['Engineering', 'Science', 'Social Sciences', 'Arts', 'Education', 'Law', 'Medicine', 'Agriculture', 'Environmental Sciences'];

export default function RegisterPage() {
  const { register, error, clearError, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', matric_number: '', phone: '',
    faculty: '', department: '', password: '', password_confirmation: '',
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await initializeCsrfToken();
      await register(form);
      navigate('/login');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/university.jpg')] bg-cover bg-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-primary-900/70 backdrop-blur-sm"></div>
      <div className="w-full max-w-2xl animate-fade-in relative z-10">
        <Link to="/" className="absolute -top-12 left-0 inline-flex items-center gap-2 text-white/80 hover:text-white transition text-base font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-primary-100 mt-2 text-base">Register as a student on SCVS</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 shadow-xl space-y-4">
          {error && <div className="bg-danger-50 text-danger-600 text-sm p-3 rounded-lg">{error}</div>}

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-base font-medium text-surface-700 mb-1.5">First Name</label>
              <input type="text" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-base" />
            </div>
            <div>
              <label className="block text-base font-medium text-surface-700 mb-1.5">Last Name</label>
              <input type="text" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-base" />
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-surface-700 mb-1.5">Matric Number</label>
            <input type="text" value={form.matric_number} onChange={(e) => update('matric_number', e.target.value)} required placeholder="e.g. STU/2025/001" className="w-full px-5 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-base" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-base font-medium text-surface-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-base" />
            </div>
            <div>
              <label className="block text-base font-medium text-surface-700 mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-base" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-base font-medium text-surface-700 mb-1.5">Faculty</label>
              <select value={form.faculty} onChange={(e) => update('faculty', e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-base bg-white">
                <option value="">Select</option>
                {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-surface-700 mb-1.5">Department</label>
              <input type="text" value={form.department} onChange={(e) => update('department', e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-base" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-base font-medium text-surface-700 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} className="w-full px-5 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-base" />
            </div>
            <div>
              <label className="block text-base font-medium text-surface-700 mb-1.5">Confirm Password</label>
              <input type="password" value={form.password_confirmation} onChange={(e) => update('password_confirmation', e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-500 outline-none text-base" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-lg shadow-primary-600/25 text-base mt-4">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-base text-surface-500">
            Already registered? <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
