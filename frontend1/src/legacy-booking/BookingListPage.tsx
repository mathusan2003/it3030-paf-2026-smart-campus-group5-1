import React from 'react';
import { Search } from 'lucide-react';
import BookingTable from './components/BookingTable';
import BookingDetailsModal from './components/BookingDetailsModal';
import { LoadingSpinner, EmptyState } from './components/Common';
import { useToast, ToastContainer } from './components/Toast';
import {
  approveBooking,
  cancelBooking,
  getBookings,
  requestBookingCancellation,
  rejectBooking,
} from '../services/api';
import { filterBookings } from './utils/bookingHelpers';
import { useAuth } from '../contexts/AuthContext';

export default function BookingListPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<unknown[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<unknown>(null);
  const { toasts, pushToast, removeToast } = useToast();

  const loadBookings = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const adminView = user?.role === 'administrator';
      const userId = adminView ? undefined : user?.id;
      const data = await getBookings(
        adminView ? { adminView: true } : { userId, adminView: false }
      );
      setBookings(Array.isArray(data) ? data : []);
    } catch (fetchError: unknown) {
      const ax = fetchError as { response?: { data?: { message?: string } } };
      setError('Unable to load bookings from backend.');
      setBookings([]);
      pushToast('error', ax?.response?.data?.message || 'Backend unavailable.');
    } finally {
      setLoading(false);
    }
  }, [pushToast, user?.id, user?.role]);

  React.useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  let filtered = filterBookings(bookings, search);
  if (statusFilter !== 'all') {
    filtered = filtered.filter((b: { status?: string }) => b.status === statusFilter);
  }

  const runAction = async (id: string, action: 'approve' | 'reject' | 'cancel' | 'requestCancel') => {
    setActionLoadingId(id);
    try {
      if (action === 'approve') {
        await approveBooking(id);
        pushToast('success', `Booking #${id} approved.`);
      } else if (action === 'reject') {
        await rejectBooking(id);
        pushToast('success', `Booking #${id} rejected.`);
      } else if (action === 'requestCancel') {
        const reason = window.prompt('Provide reason for cancellation request:');
        if (!reason || !reason.trim()) {
          pushToast('error', 'Cancellation reason is required.');
          return;
        }
        await requestBookingCancellation(id, reason.trim());
        pushToast('success', `Cancellation request sent for booking #${id}.`);
      } else {
        await cancelBooking(id);
        pushToast('success', `Booking #${id} cancelled.`);
      }
      setDetailsModalOpen(false);
      await loadBookings();
    } catch (requestError: unknown) {
      const ax = requestError as { response?: { data?: { message?: string } } };
      const fallbackMessage =
        action === 'approve'
          ? 'Unable to approve booking.'
          : action === 'reject'
            ? 'Unable to reject booking.'
            : action === 'requestCancel'
              ? 'Unable to request cancellation.'
            : 'Unable to cancel booking.';
      pushToast('error', ax?.response?.data?.message || fallbackMessage);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#374151]">My Bookings</h1>
          <p className="mt-2 text-[#9CA3AF]">Manage booking requests and approvals</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative mb-4 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-[#374151] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          <span className="text-sm font-medium text-[#9CA3AF]">Status:</span>
          {['all', 'PENDING', 'APPROVED', 'CANCEL_REQUESTED', 'REJECTED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-[#F3F4F6] text-[#9CA3AF] hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length > 0 ? (
        <BookingTable
          bookings={filtered}
          loading={false}
          onApprove={(id: string) => runAction(id, 'approve')}
          onReject={(id: string) => runAction(id, 'reject')}
          onCancel={(id: string) => runAction(id, 'cancel')}
          onRequestCancel={(id: string) => runAction(id, 'requestCancel')}
          onRowClick={(booking: unknown) => {
            setSelectedBooking(booking);
            setDetailsModalOpen(true);
          }}
          actionLoadingId={actionLoadingId}
          userRole={user?.role}
        />
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-12 shadow-sm">
          <EmptyState
            title="No bookings found"
            description={
              search ? 'Try adjusting your search criteria.' : 'Create a new booking to get started.'
            }
          />
        </div>
      )}

      <BookingDetailsModal
        booking={selectedBooking}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        onApprove={(id: string) => runAction(id, 'approve')}
        onReject={(id: string) => runAction(id, 'reject')}
        onCancel={(id: string) => runAction(id, 'cancel')}
        onRequestCancel={(id: string) => runAction(id, 'requestCancel')}
        actionLoading={actionLoadingId !== null}
        userRole={user?.role}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
