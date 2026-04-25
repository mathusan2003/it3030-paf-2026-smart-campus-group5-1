import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Users() {
  const demoUsers = useMemo(
    () => [
      { name: 'Student User', email: 'student@campus.edu', role: 'STUDENT' },
      { name: 'Admin User', email: 'admin@campus.edu', role: 'ADMIN' },
      { name: 'Technician User', email: 'tech@campus.edu', role: 'TECHNICIAN' },
    ],
    []
  );

  const { user } = useAuth();
  if (user?.role !== 'administrator') {
    return <p className="text-sm text-gray-500">Only admin can access users.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Users</h1>
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody>
            {demoUsers.map((u) => (
              <tr key={u.email} className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-700">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-gray-700">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

