import React, { useEffect, useState } from 'react';
import { Plus, AlertTriangle, Clock, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { getTickets, createTicket, updateTicketStatus, assignTicket, getTechnicians } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';

interface IncidentTicket {
  id: string;
  createdByUserId?: string;
  resourceId?: string;
  location?: string;
  category?: string;
  description?: string;
  priority?: string;
  preferredContact?: string;
  status?: TicketStatus;
  assignedTechnicianUserId?: string;
  resolutionNotes?: string;
  rejectReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TechnicianUser {
  id: string;
  name: string;
  email?: string;
}

const INCIDENT_CATEGORY_OPTIONS = [
  'Lecture Hall',
  'Lab',
  'Meeting Room',
  'Equipment - Projector',
  'Equipment - Camera',
  'Equipment - Other',
];

const STATUS_OPTIONS: TicketStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'REJECTED',
];

export default function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<IncidentTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [technicians, setTechnicians] = useState<TechnicianUser[]>([]);
  const [form, setForm] = useState({
    resourceId: '',
    location: '',
    category: 'Lecture Hall',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    preferredContact: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (user?.role === 'student') {
        params.createdByUserId = user.id;
      }
      const data = await getTickets(params);
      setTickets(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Could not load tickets.');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.id, user?.role]);

  useEffect(() => {
    const loadTechnicians = async () => {
      if (user?.role !== 'administrator') return;
      try {
        const data = await getTechnicians();
        setTechnicians(Array.isArray(data) ? data : []);
      } catch {
        setTechnicians([]);
        toast.error('Could not load technicians list.');
      }
    };
    loadTechnicians();
  }, [user?.role]);

  const handleStatusChange = async (ticketId: string, status: TicketStatus) => {
    try {
      await updateTicketStatus(ticketId, {
        status,
        reason: status === 'REJECTED' ? 'Rejected from UI' : undefined,
        resolutionNotes: status === 'RESOLVED' ? 'Resolved from UI' : undefined,
      });
      toast.success('Ticket updated');
      await load();
    } catch (e: unknown) {
      const ax = e as { response?: { data?: { message?: string } } };
      toast.error(ax?.response?.data?.message || 'Update failed');
    }
  };

  const handleAssignSelf = async (ticketId: string) => {
    if (!user?.id) return;
    try {
      await assignTicket(ticketId, user.id);
      toast.success('Assigned to you');
      await load();
    } catch {
      toast.error('Assign failed');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await createTicket({
        createdByUserId: user.id,
        resourceId: form.resourceId.trim(),
        location: form.location.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        priority: form.priority,
        preferredContact: form.preferredContact.trim(),
        attachments: [],
      });
      toast.success('Ticket created');
      setShowForm(false);
      setForm({
        resourceId: '',
        location: '',
        category: 'Lecture Hall',
        description: '',
        priority: 'MEDIUM',
        preferredContact: '',
      });
      await load();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      toast.error(ax?.response?.data?.message || 'Create failed');
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const st = ticket.status || '';
    const matchesFilter = filter === 'all' || st === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (ticket.description || '').toLowerCase().includes(q) ||
      (ticket.category || '').toLowerCase().includes(q) ||
      (ticket.location || '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const displayStatus = (s?: string) =>
    (s || '').replace(/_/g, ' ').toLowerCase();

  const getTechnicianName = (technicianId?: string) => {
    if (!technicianId) return '';
    return technicians.find((t) => t.id === technicianId)?.name || technicianId;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#374151] mb-2">Support Tickets</h1>
          <p className="text-[#9CA3AF]">Spring Boot /api/tickets</p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#1D4ED8] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4"
        >
          <h3 className="font-semibold text-[#374151]">Create incident ticket</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="text-[#6B7280]">Resource ID</span>
              <input
                required
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.resourceId}
                onChange={(e) => setForm((f) => ({ ...f, resourceId: e.target.value }))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#6B7280]">Location</span>
              <input
                required
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#6B7280]">Category</span>
              <select
                required
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {INCIDENT_CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-[#6B7280]">Priority</span>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as typeof form.priority,
                  }))
                }
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="text-[#6B7280]">Preferred contact</span>
              <input
                required
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.preferredContact}
                onChange={(e) => setForm((f) => ({ ...f, preferredContact: e.target.value }))}
              />
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="text-[#6B7280]">Description</span>
              <textarea
                required
                rows={3}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-[#10B981] text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
          >
            Submit ticket
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#9CA3AF]" />
            <select
              aria-label="Filter tickets by status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {displayStatus(s)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-[#9CA3AF]">Loading…</p>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#374151] mb-2">No tickets found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#374151] mb-2 line-clamp-2">
                    {ticket.category || 'Ticket'}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800 capitalize flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {displayStatus(ticket.status)}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {ticket.priority || ''}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#9CA3AF] mb-4 line-clamp-4">{ticket.description}</p>

              <div className="space-y-2 mb-4 text-xs text-[#9CA3AF]">
                <div>Location: {ticket.location}</div>
                {ticket.createdAt && (
                  <div>Created: {format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm')}</div>
                )}
                {ticket.assignedTechnicianUserId && (
                  <div>Assigned: {getTechnicianName(ticket.assignedTechnicianUserId)}</div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {user?.role === 'technician' &&
                  ticket.status === 'OPEN' &&
                  !ticket.assignedTechnicianUserId && (
                    <button
                      type="button"
                      onClick={() => handleAssignSelf(ticket.id)}
                      className="flex-1 py-2 px-3 bg-[#3B82F6] text-white text-sm rounded-lg hover:bg-blue-600"
                    >
                      Assign to me
                    </button>
                  )}
                {(user?.role === 'administrator' || user?.role === 'technician') &&
                  ticket.status === 'OPEN' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(ticket.id, 'IN_PROGRESS')}
                      className="flex-1 py-2 px-3 bg-[#3B82F6] text-white text-sm rounded-lg hover:bg-blue-600"
                    >
                      Start
                    </button>
                  )}
                {(user?.role === 'administrator' || user?.role === 'technician') &&
                  ticket.status === 'IN_PROGRESS' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(ticket.id, 'RESOLVED')}
                      className="flex-1 py-2 px-3 bg-[#10B981] text-white text-sm rounded-lg hover:bg-green-600"
                    >
                      Resolve
                    </button>
                  )}
                {user?.role === 'administrator' && ticket.status === 'RESOLVED' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(ticket.id, 'CLOSED')}
                    className="flex-1 py-2 px-3 bg-slate-600 text-white text-sm rounded-lg"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
