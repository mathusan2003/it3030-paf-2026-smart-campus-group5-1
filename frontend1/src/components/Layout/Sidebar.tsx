import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Ticket, 
  Bell, 
  LogOut,
  Settings,
  Users,
  BarChart3,
  ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigationByRole = {
  student: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'My Bookings', href: '/bookings', icon: Calendar },
    { name: 'My Tickets', href: '/tickets', icon: Ticket },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ],
  administrator: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Manage Resources', href: '/resources', icon: BookOpen },
    { name: 'Manage Bookings', href: '/bookings', icon: Calendar },
    { name: 'Manage Tickets', href: '/tickets', icon: Ticket },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ],
  technician: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Assigned Tickets', href: '/tickets-assigned', icon: Ticket },
    { name: 'Completed Tasks', href: '/tasks-completed', icon: ClipboardCheck },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ],
} as const;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const filteredNavigation = user ? navigationByRole[user.role] : [];

  return (
    <div className="w-64 bg-[#1E40AF] min-h-screen flex flex-col">
      <div className="flex items-center px-6 py-4 border-b border-blue-600">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#06B6D4] rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="ml-3 text-white text-lg font-semibold">Campus Hub</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-[#1D4ED8] text-white'
                      : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {user && (
        <div className="border-t border-blue-600 p-4">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#06B6D4] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-blue-200 text-xs capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm text-blue-100 hover:bg-blue-600 hover:text-white rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}