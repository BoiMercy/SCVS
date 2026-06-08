import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-surface-900">User Management</h1>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-surface-600 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-surface-50 transition">
                  <td className="px-6 py-4 font-medium">{u.first_name} {u.last_name}</td>
                  <td className="px-6 py-4 text-surface-600">{u.email}</td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold">{u.role.display_name}</span></td>
                  <td className="px-6 py-4">
                    {u.is_active ? <span className="text-success-600 font-medium">Active</span> : <span className="text-danger-600 font-medium">Disabled</span>}
                  </td>
                  <td className="px-6 py-4 text-surface-500">{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
