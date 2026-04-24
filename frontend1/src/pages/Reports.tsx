import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Bot, Download, FileText, Lightbulb, RefreshCw, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getBookingSuggestions, getBookings, getResources, getTickets } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { exportCampusReportToPDF } from '../legacy-booking/services/exportService';

interface ApiBooking {
  id: string;
  userId?: string;
  resourceId?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  purpose?: string;
  expectedAttendees?: number;
  status?: 'PENDING' | 'APPROVED' | 'CANCEL_REQUESTED' | 'REJECTED' | 'CANCELLED';
}

interface ApiTicket {
  id: string;
  resourceId?: string;
  category?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  assignedTechnicianUserId?: string;
}

interface ApiResource {
  id: string;
  name?: string;
  type?: string;
  capacity?: number;
  location?: string;
  status?: 'ACTIVE' | 'BOOKED' | 'OUT_OF_SERVICE';
}

interface AiResponse {
  enabled?: boolean;
  suggestion?: string;
}

const statusTone: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-slate-100 text-slate-700',
  BOOKED: 'bg-amber-100 text-amber-700',
  PENDING: 'bg-amber-100 text-amber-700',
  CANCEL_REQUESTED: 'bg-orange-100 text-orange-700',
  OPEN: 'bg-orange-100 text-orange-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  REJECTED: 'bg-rose-100 text-rose-700',
  CANCELLED: 'bg-slate-100 text-slate-700',
  OUT_OF_SERVICE: 'bg-rose-100 text-rose-700',
};

const today = () => new Date().toISOString().slice(0, 10);

const labelText = (value: string) => value.replace(/_/g, ' ');

const exportReport = exportCampusReportToPDF as unknown as (data: {
  bookings: ApiBooking[];
  tickets: ApiTicket[];
  resources: ApiResource[];
  aiSuggestion: string;
}) => Promise<void>;

const countBy = <T,>(items: T[], getKey: (item: T) => string | undefined) => {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const key = getKey(item) || 'UNKNOWN';
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
};

function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="rounded-xl bg-blue-50 p-2">
          <Icon className="h-4 w-4 text-blue-600" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  const max = Math.max(...rows.map(([, count]) => count), 1);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
        <BarChart3 className="h-4 w-4 text-blue-600" />
        {title}
      </h2>
      <div className="space-y-3">
        {rows.length ? rows.map(([label, count]) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusTone[label] || 'bg-slate-100 text-slate-700'}`}>
                {labelText(label)}
              </span>
              <span className="font-semibold text-slate-700">{count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max((count / max) * 100, 8)}%` }} />
            </div>
          </div>
        )) : (
          <p className="text-sm text-slate-500">No data available yet.</p>
        )}
      </div>
    </div>
  );
}

export default function Reports() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiForm, setAiForm] = useState({
    resourceId: '',
    bookingDate: today(),
    startTime: '09:00',
    endTime: '11:00',
    expectedAttendees: '25',
    purpose: 'Workshop or class session',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [b, t, r] = await Promise.all([
        getBookings({ adminView: true }),
        getTickets(),
        getResources(),
      ]);
      const nextBookings = Array.isArray(b) ? b : [];
      const nextTickets = Array.isArray(t) ? t : [];
      const nextResources = Array.isArray(r) ? r : [];
      setBookings(nextBookings);
      setTickets(nextTickets);
      setResources(nextResources);
      setAiForm((current) => ({
        ...current,
        resourceId: current.resourceId || nextResources[0]?.id || '',
      }));
    } catch {
      toast.error('Unable to load report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const analytics = useMemo(() => {
    const approvedBookings = bookings.filter((b) => b.status === 'APPROVED').length;
    const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
    const activeTickets = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
    const bookedResources = resources.filter((r) => r.status === 'BOOKED').length;
    const utilization = resources.length ? Math.round((bookedResources / resources.length) * 100) : 0;
    const approvalRate = bookings.length ? Math.round((approvedBookings / bookings.length) * 100) : 0;
    const ticketResolutionRate = tickets.length
      ? Math.round((tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length / tickets.length) * 100)
      : 0;

    return {
      approvedBookings,
      pendingBookings,
      activeTickets,
      bookedResources,
      utilization,
      approvalRate,
      ticketResolutionRate,
    };
  }, [bookings, tickets, resources]);

  const bookingStatusRows = useMemo(() => countBy(bookings, (b) => b.status), [bookings]);
  const ticketStatusRows = useMemo(() => countBy(tickets, (t) => t.status), [tickets]);
  const resourceStatusRows = useMemo(() => countBy(resources, (r) => r.status), [resources]);
  const resourceTypeRows = useMemo(() => countBy(resources, (r) => r.type), [resources]);

  const topBookedResources = useMemo(() => {
    const bookingCounts = countBy(bookings, (b) => b.resourceId);
    return bookingCounts.slice(0, 5).map(([resourceId, count]) => {
      const resource = resources.find((r) => r.id === resourceId);
      return {
        resourceId,
        count,
        name: resource?.name || resourceId,
        status: resource?.status || 'UNKNOWN',
      };
    });
  }, [bookings, resources]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportReport({ bookings, tickets, resources, aiSuggestion });
      toast.success('PDF report exported.');
    } catch {
      toast.error('PDF export failed.');
    } finally {
      setExporting(false);
    }
  };

  const handleAiSuggestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAiLoading(true);
    setAiSuggestion('');
    try {
      const response: AiResponse = await getBookingSuggestions({
        userId: user?.id || 'admin-1',
        resourceId: aiForm.resourceId,
        bookingDate: aiForm.bookingDate,
        startTime: aiForm.startTime,
        endTime: aiForm.endTime,
        expectedAttendees: Number(aiForm.expectedAttendees),
        purpose: aiForm.purpose,
      });
      setAiSuggestion(response.suggestion || 'No suggestion returned.');
      toast.success(response.enabled ? 'AI suggestions generated.' : 'AI fallback message loaded.');
    } catch {
      toast.error('Unable to generate AI suggestions.');
    } finally {
      setAiLoading(false);
    }
  };

  if (user?.role !== 'administrator') {
    return <p className="text-sm text-gray-500">Only admin can access reports.</p>;
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading report data...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Member 5 module</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Reports and Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Campus-wide booking, resource, and incident intelligence.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            disabled={exporting}
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Resource Utilization" value={`${analytics.utilization}%`} helper={`${analytics.bookedResources} of ${resources.length} resources booked`} icon={TrendingUp} />
        <MetricCard title="Booking Approval Rate" value={`${analytics.approvalRate}%`} helper={`${analytics.approvedBookings} approved bookings`} icon={FileText} />
        <MetricCard title="Pending Approvals" value={analytics.pendingBookings} helper="Bookings waiting for admin action" icon={Lightbulb} />
        <MetricCard title="Ticket Resolution Rate" value={`${analytics.ticketResolutionRate}%`} helper={`${analytics.activeTickets} active tickets remaining`} icon={BarChart3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Breakdown title="Booking Status" rows={bookingStatusRows} />
        <Breakdown title="Ticket Status" rows={ticketStatusRows} />
        <Breakdown title="Resource Status" rows={resourceStatusRows} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Top Booked Resources</h2>
          <div className="space-y-3">
            {topBookedResources.length ? topBookedResources.map((resource) => (
              <div key={resource.resourceId} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-800">{resource.name}</p>
                  <p className="text-xs text-slate-500">Resource ID: {resource.resourceId}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{resource.count}</p>
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusTone[resource.status] || 'bg-slate-100 text-slate-700'}`}>
                    {labelText(resource.status)}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No booking activity yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Resource Type Mix</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {resourceTypeRows.length ? resourceTypeRows.map(([type, count]) => (
              <div key={type} className="rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{labelText(type)}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{count}</p>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No resources available yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Bot className="h-5 w-5 text-blue-600" />
              AI Booking Suggestions
            </h2>
            <p className="mt-1 text-sm text-slate-500">Generate optimization ideas for a proposed booking request.</p>
          </div>
        </div>

        <form onSubmit={handleAiSuggestion} className="grid gap-4 lg:grid-cols-6">
          <label className="text-sm lg:col-span-2">
            <span className="font-medium text-slate-600">Resource</span>
            <select
              value={aiForm.resourceId}
              onChange={(event) => setAiForm((current) => ({ ...current, resourceId: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
              required
            >
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name || resource.id}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-600">Date</span>
            <input
              type="date"
              value={aiForm.bookingDate}
              onChange={(event) => setAiForm((current) => ({ ...current, bookingDate: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-600">Start</span>
            <input
              type="time"
              value={aiForm.startTime}
              onChange={(event) => setAiForm((current) => ({ ...current, startTime: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-600">End</span>
            <input
              type="time"
              value={aiForm.endTime}
              onChange={(event) => setAiForm((current) => ({ ...current, endTime: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <label className="text-sm">
            <span className="font-medium text-slate-600">Attendees</span>
            <input
              type="number"
              min={1}
              value={aiForm.expectedAttendees}
              onChange={(event) => setAiForm((current) => ({ ...current, expectedAttendees: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <label className="text-sm lg:col-span-5">
            <span className="font-medium text-slate-600">Purpose</span>
            <input
              value={aiForm.purpose}
              onChange={(event) => setAiForm((current) => ({ ...current, purpose: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              required
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={aiLoading || !resources.length}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
            >
              {aiLoading ? 'Thinking...' : 'Suggest'}
            </button>
          </div>
        </form>

        {aiSuggestion ? (
          <div className="mt-5 rounded-xl border border-blue-100 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">Suggestion Output</p>
            <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{aiSuggestion}</pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
