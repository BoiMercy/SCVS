import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, type UserData } from '../store/useAuthStore';
import { LayoutDashboard, FileText, CheckCircle, Download, Bell, Users, BarChart3, ScrollText, Settings, LogOut, Menu, X, Shield } from 'lucide-react';

const studentNav = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/apply', label: 'Apply for Clearance', icon: FileText },
  { to: '/student/status', label: 'Track Status', icon: CheckCircle },
  { to: '/student/certificate', label: 'Certificate', icon: Download },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
];
const officerNav = [
  { to: '/officer/dashboard', label: 'Review Queue', icon: LayoutDashboard },
  { to: '/officer/history', label: 'Review History', icon: ScrollText },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
];
const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
];

function getNavItems(user: UserData | null) {
  if (!user) return [];
  const role = user.role.name;
  if (role === 'student') return studentNav;
  if (role === 'super_admin') return adminNav;
  return officerNav;
}

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = getNavItems(user);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-surface-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-700">
          <Shield className="w-8 h-8 text-primary-400" />
          <span className="text-lg font-bold tracking-tight">SCVS</span>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'text-surface-300 hover:bg-surface-800 hover:text-white'}`}>
                <Icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-700">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-surface-400 truncate">{user?.role?.display_name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 shrink-0">
          <button className="lg:hidden p-2 rounded-lg hover:bg-surface-100" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-sm text-surface-500 hidden sm:block">
            Student Clearance & Verification System
          </div>
          <div className="flex items-center gap-4">
            <Link to="/student/notifications" className="relative p-2 rounded-lg hover:bg-surface-100 transition">
              <Bell className="w-5 h-5 text-surface-500" />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
