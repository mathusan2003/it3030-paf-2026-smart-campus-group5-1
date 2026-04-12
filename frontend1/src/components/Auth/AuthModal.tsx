import React, { useState } from 'react';
import { X, Loader2, Eye, EyeOff, Settings, GraduationCap, Shield, Wrench } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

const roles: { value: User['role']; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'student', label: 'Student', icon: GraduationCap, description: 'Access resources and manage bookings' },
  { value: 'administrator', label: 'Administrator', icon: Shield, description: 'Oversee all campus operations' },
  { value: 'technician', label: 'Technician', icon: Wrench, description: 'Handle maintenance and support tickets' },
];

export default function AuthModal({ initialMode = 'login', onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as User['role'],
  });

  const { login, register } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      onClose();
    } catch {
      // error shown by context
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      return;
    }
    setLoading(true);
    try {
      await register(registerData.name, registerData.email, registerData.password, registerData.role);
      onClose();
    } catch {
      // error shown by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0EA5E9] rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[#111827] text-lg">Campus Hub</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mode === 'login'
                ? 'text-[#0EA5E9] border-b-2 border-[#0EA5E9]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mode === 'register'
                ? 'text-[#0EA5E9] border-b-2 border-[#0EA5E9]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <p className="text-[#111827] font-semibold text-xl mb-1">Welcome back</p>
                <p className="text-gray-500 text-sm mb-6">Sign in to access your campus hub</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="you@campus.edu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent outline-none transition-all text-sm pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0EA5E9] text-white py-2.5 rounded-xl font-semibold hover:bg-[#0284C7] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <p className="text-center text-sm text-gray-500 pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#0EA5E9] font-medium hover:underline"
                >
                  Create one
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <p className="text-[#111827] font-semibold text-xl mb-1">Get started</p>
                <p className="text-gray-500 text-sm mb-6">Create your account to access the campus hub</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={e => setRegisterData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={e => setRegisterData(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="you@campus.edu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRegisterData(p => ({ ...p, role: value }))}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-medium ${
                        registerData.role === value
                          ? 'border-[#0EA5E9] bg-[#0EA5E9]/5 text-[#0EA5E9]'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={e => setRegisterData(p => ({ ...p, password: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent outline-none transition-all text-sm pr-10"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.confirmPassword}
                  onChange={e => setRegisterData(p => ({ ...p, confirmPassword: e.target.value }))}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent outline-none transition-all text-sm ${
                    registerData.confirmPassword && registerData.password !== registerData.confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200'
                  }`}
                  placeholder="Repeat your password"
                  required
                />
                {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || (!!registerData.confirmPassword && registerData.password !== registerData.confirmPassword)}
                className="w-full bg-[#0EA5E9] text-white py-2.5 rounded-xl font-semibold hover:bg-[#0284C7] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              <p className="text-center text-sm text-gray-500 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#0EA5E9] font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
