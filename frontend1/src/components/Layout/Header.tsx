import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
              <input
                type="text"
                placeholder="Search resources, tickets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button aria-label="Open notifications" className="relative p-2 text-[#9CA3AF] hover:text-[#374151] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#EF4444] rounded-full"></span>
            </button>
            
            {user && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#06B6D4] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-[#374151]">{user.name}</p>
                  <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">
                    {user.role === 'administrator' ? 'ADMIN' : user.role === 'technician' ? 'TECHNICIAN' : 'STUDENT'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}