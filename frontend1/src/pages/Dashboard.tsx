import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Bell, BookOpen, Calendar, CheckCircle2, Clock3, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { getBookings, getNotifications, getResources, getTickets } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ApiBooking {
  id: string;
  userId?: string;
  resourceId?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

interface ApiTicket {
  id: string;
  createdByUserId?: string;
  resourceId?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  assignedTechnicianUserId?: string;
}

interface ApiNotification {
  id: string;
  title: string;
  read: boolean;
}

interface ApiResource {
  id: string;
  status?: 'ACTIVE' | 'OUT_OF_SERVICE';
}

function StatCard({ title, value, icon: Icon }: { title: string; value: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon className="h-4 w-4 text-blue-500" />
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function StatusPill({ text }: { text?: string }) {
  const status = (text || 'UNKNOWN').toUpperCase();
  const colors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-rose-100 text-rose-700',
    CANCELLED: 'bg-slate-100 text-slate-700',
    OPEN: 'bg-amber-100 text-amber-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-emerald-100 text-emerald-700',
    CLOSED: 'bg-slate-100 text-slate-700',
  };
  return <span className={`rounded-md px-2 py-1 text-xs font-medium ${colors[status] || 'bg-slate-100 text-slate-700'}`}>{status.replace('_', ' ')}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const bookingParams = user.role === 'administrator' ? { adminView: true } : { userId: user.id, adminView: false };
        const ticketParams = user.role === 'student' ? { createdByUserId: user.id } : {};

        const [b, t, n, r] = await Promise.all([
          getBookings(bookingParams),
          getTickets(ticketParams),
          getNotifications(user.id),
          getResources(),
        ]);

        setBookings(Array.isArray(b) ? b : []);
        setTickets(Array.isArray(t) ? t : []);
        setNotifications(Array.isArray(n) ? n : []);
        setResources(Array.isArray(r) ? r : []);
      } catch {
        toast.error('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const studentStats = useMemo(() => {
    return {
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
      activeTickets: tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
      notificationsCount: notifications.filter((n) => !n.read).length,
    };
  }, [bookings, tickets, notifications]);

  const adminStats = useMemo(() => {
    return {
      totalResources: resources.length,
      totalBookings: bookings.length,
      pendingApprovals: bookings.filter((b) => b.status === 'PENDING').length,
      openTickets: tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
    };
  }, [resources, bookings, tickets]);

  const technicianStats = useMemo(() => {
    const assigned = tickets.filter((t) => t.assignedTechnicianUserId === user?.id);
    return {
      assignedTickets: assigned.length,
      inProgress: assigned.filter((t) => t.status === 'IN_PROGRESS').length,
      completed: assigned.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
    };
  }, [tickets, user?.id]);

  const bookingByDay = useMemo(() => {
    const map = new Map<string, number>();
    bookings.forEach((b) => {
      const key = b.bookingDate || 'N/A';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).slice(0, 7);
  }, [bookings]);

  const ticketByStatus = useMemo(() => {
    const map = new Map<string, number>();
    tickets.forEach((t) => {
      const key = t.status || 'UNKNOWN';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries());
  }, [tickets]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading dashboard...</p>;
  }

  if (!user) {
    return null;
  }

  if (user.role === 'student') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Bookings" value={studentStats.totalBookings} icon={Calendar} />
          <StatCard title="Pending Bookings" value={studentStats.pendingBookings} icon={Clock3} />
          <StatCard title="Active Tickets" value={studentStats.activeTickets} icon={Ticket} />
          <StatCard title="Notifications" value={studentStats.notificationsCount} icon={Bell} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-700">Recent Bookings</h2>
            <div className="space-y-2">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">{b.resourceId || 'Resource'}</p>
                    <p className="text-gray-500">{b.bookingDate} {b.startTime} - {b.endTime}</p>
                  </div>
                  <StatusPill text={b.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-700">My Tickets</h2>
            <div className="space-y-2">
              {tickets.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">{t.resourceId || 'Issue'}</p>
                    <p className="text-gray-500 line-clamp-1">{t.description || '-'}</p>
                  </div>
                  <StatusPill text={t.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-700">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/bookings')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ Book Resource</button>
            <button onClick={() => navigate('/tickets')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Report Issue</button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'administrator') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Resources" value={adminStats.totalResources} icon={BookOpen} />
          <StatCard title="Total Bookings" value={adminStats.totalBookings} icon={Calendar} />
          <StatCard title="Pending Approvals" value={adminStats.pendingApprovals} icon={Clock3} />
          <StatCard title="Open Tickets" value={adminStats.openTickets} icon={Ticket} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-700">Pending Booking Requests</h2>
            <div className="space-y-2">
              {bookings.filter((b) => b.status === 'PENDING').slice(0, 6).map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">{b.userId || 'User'} • {b.resourceId || 'Resource'}</p>
                    <p className="text-gray-500">{b.bookingDate} {b.startTime} - {b.endTime}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate('/bookings')} className="rounded bg-emerald-600 px-2 py-1 text-xs text-white">Approve</button>
                    <button onClick={() => navigate('/bookings')} className="rounded bg-rose-600 px-2 py-1 text-xs text-white">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-700">Active Tickets</h2>
            <div className="space-y-2">
              {tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">{t.resourceId || 'Resource'} • {t.priority || 'MEDIUM'}</p>
                    <p className="text-gray-500 line-clamp-1">{t.description || '-'}</p>
                  </div>
                  <button onClick={() => navigate('/tickets')} className="rounded bg-blue-600 px-2 py-1 text-xs text-white">Assign</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-700"><BarChart3 className="h-4 w-4" /> Bookings Per Day</h2>
            <div className="space-y-2">
              {bookingByDay.map(([day, count]) => (
                <div key={day} className="flex items-center justify-between rounded bg-blue-50 px-3 py-2 text-sm">
                  <span className="text-gray-500">{day}</span>
                  <span className="rounded bg-blue-100 px-2 py-0.5 font-medium text-blue-700">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-700"><BarChart3 className="h-4 w-4" /> Ticket Status Distribution</h2>
            <div className="space-y-2">
              {ticketByStatus.map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded bg-emerald-50 px-3 py-2 text-sm">
                  <span className="text-gray-500">{status}</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-700">Resource Status</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded bg-emerald-100 px-3 py-1 text-emerald-700">ACTIVE: {resources.filter((r) => r.status === 'ACTIVE').length}</span>
            <span className="rounded bg-rose-100 px-3 py-1 text-rose-700">OUT_OF_SERVICE: {resources.filter((r) => r.status === 'OUT_OF_SERVICE').length}</span>
          </div>
        </div>
      </div>
    );
  }

  const assignedTickets = tickets.filter((t) => t.assignedTechnicianUserId === user.id);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Technician Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Assigned Tickets" value={technicianStats.assignedTickets} icon={Ticket} />
        <StatCard title="In Progress" value={technicianStats.inProgress} icon={Clock3} />
        <StatCard title="Completed" value={technicianStats.completed} icon={CheckCircle2} />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-700">Assigned Tickets</h2>
        <div className="space-y-2">
          {assignedTickets.slice(0, 8).map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-sm">
                <p className="font-medium text-gray-700">{t.resourceId || 'Resource'} • {t.priority || 'MEDIUM'}</p>
                <p className="text-gray-500 line-clamp-1">{t.description || '-'}</p>
              </div>
              <button onClick={() => navigate('/tickets')} className="rounded bg-blue-600 px-2 py-1 text-xs text-white">Update</button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-700">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/tickets-assigned')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">My Assigned Tickets</button>
          <button onClick={() => navigate('/tasks-completed')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Completed Tasks</button>
          <button onClick={() => navigate('/notifications')} className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Open Notifications</button>
        </div>
      </div>
    </div>
  );
}

