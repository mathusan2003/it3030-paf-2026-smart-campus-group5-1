import { useEffect, useState } from 'react';
import { getTickets } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface TicketItem {
  id: string;
  resourceId?: string;
  description?: string;
  status?: string;
  assignedTechnicianUserId?: string;
}

export default function CompletedTasks() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getTickets();
      const all = Array.isArray(data) ? data : [];
      setTickets(
        all.filter(
          (t: TicketItem) =>
            t.assignedTechnicianUserId === user?.id &&
            (t.status === 'RESOLVED' || t.status === 'CLOSED')
        )
      );
    };
    load();
  }, [user?.id]);

  if (user?.role !== 'technician') {
    return <p className="text-sm text-gray-500">Only technicians can access this page.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Completed Tasks</h1>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="font-semibold text-gray-700">{t.resourceId || 'Resource'}</p>
            <p className="mt-1 text-sm text-gray-500">{t.description || '-'}</p>
            <p className="mt-2 text-xs text-emerald-700">Status: {t.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

