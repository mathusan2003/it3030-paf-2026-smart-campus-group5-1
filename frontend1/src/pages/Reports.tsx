import { useEffect, useMemo, useState } from 'react';
import { getBookings, getTickets } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ItemWithStatus {
  id: string;
  status?: string;
}

export default function Reports() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ItemWithStatus[]>([]);
  const [tickets, setTickets] = useState<ItemWithStatus[]>([]);

  useEffect(() => {
    const load = async () => {
      const [b, t] = await Promise.all([getBookings({ adminView: true }), getTickets()]);
      setBookings(Array.isArray(b) ? b : []);
      setTickets(Array.isArray(t) ? t : []);
    };
    load();
  }, []);

  const bookingStats = useMemo(() => {
    return {
      approved: bookings.filter((b) => b.status === 'APPROVED').length,
      pending: bookings.filter((b) => b.status === 'PENDING').length,
      rejected: bookings.filter((b) => b.status === 'REJECTED').length,
    };
  }, [bookings]);

  const ticketStats = useMemo(() => {
    return {
      open: tickets.filter((t) => t.status === 'OPEN').length,
      inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
      closed: tickets.filter((t) => t.status === 'CLOSED').length,
    };
  }, [tickets]);

  if (user?.role !== 'administrator') {
    return <p className="text-sm text-gray-500">Only admin can access reports.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-700">Booking Summary</h2>
          <p className="text-sm text-gray-600">Approved: {bookingStats.approved}</p>
          <p className="text-sm text-gray-600">Pending: {bookingStats.pending}</p>
          <p className="text-sm text-gray-600">Rejected: {bookingStats.rejected}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-700">Ticket Summary</h2>
          <p className="text-sm text-gray-600">Open: {ticketStats.open}</p>
          <p className="text-sm text-gray-600">In Progress: {ticketStats.inProgress}</p>
          <p className="text-sm text-gray-600">Resolved: {ticketStats.resolved}</p>
          <p className="text-sm text-gray-600">Closed: {ticketStats.closed}</p>
        </div>
      </div>
    </div>
  );
}

