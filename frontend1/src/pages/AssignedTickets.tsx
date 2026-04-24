import { useEffect, useState } from 'react';
import { getTickets, updateTicketStatus } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface TicketItem {
  id: string;
  resourceId?: string;
  description?: string;
  priority?: string;
  status?: string;
  assignedTechnicianUserId?: string;
}

export default function AssignedTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  const load = async () => {
    const data = await getTickets();
    const all = Array.isArray(data) ? data : [];
    setTickets(all.filter((t: TicketItem) => t.assignedTechnicianUserId === user?.id));
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const update = async (id: string, status: 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED') => {
    try {
      await updateTicketStatus(id, { status });
      toast.success('Ticket updated');
      await load();
    } catch {
      toast.error('Update failed');
    }
  };

  if (user?.role !== 'technician') {
    return <p className="text-sm text-gray-500">Only technicians can access this page.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">My Assigned Tickets</h1>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="font-semibold text-gray-700">{t.resourceId || 'Resource'} • {t.priority || 'MEDIUM'}</p>
            <p className="mt-1 text-sm text-gray-500">{t.description || '-'}</p>
            <p className="mt-2 text-xs text-gray-500">Status: {t.status}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => update(t.id, 'IN_PROGRESS')} className="rounded bg-blue-600 px-3 py-1 text-xs text-white">IN_PROGRESS</button>
              <button onClick={() => update(t.id, 'RESOLVED')} className="rounded bg-emerald-600 px-3 py-1 text-xs text-white">RESOLVED</button>
              <button onClick={() => update(t.id, 'CLOSED')} className="rounded bg-slate-700 px-3 py-1 text-xs text-white">CLOSED</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

