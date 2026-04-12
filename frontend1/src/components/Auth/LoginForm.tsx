import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      // Error handling is done in the context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D4ED8] to-[#06B6D4] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#06B6D4] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#374151] mb-2">Welcome Back</h1>
          <p className="text-[#9CA3AF]">Smart Campus Operations Hub</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent outline-none transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#374151] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent outline-none transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D4ED8] text-white py-3 px-4 rounded-lg hover:bg-[#1E40AF] transition-colors font-medium flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-[#F3F4F6] rounded-lg">
          <p className="text-sm text-[#374151] font-medium mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-[#9CA3AF]">
            <p>Student: student@campus.edu</p>
            <p>Admin: admin@campus.edu</p>
            <p>Technician: tech@campus.edu</p>
            <p>Technician: tech2@campus.edu</p>
            <p>Technician: tech3@campus.edu</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}