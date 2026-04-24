import React from 'react';
import { Search } from 'lucide-react';
import BookingModal from './components/BookingModal';
import BookingTable from './components/BookingTable';
import BookingDetailsModal from './components/BookingDetailsModal';
import ChartSection from './components/ChartSection';
import StatsCard from './components/StatsCard';
import { LoadingSpinner, EmptyState } from './components/Common';
import {
  buildSubmissionPayload,
  calculateMetrics,
  filterBookings,
  formatCurrency,
  getGreeting,
} from './utils/bookingHelpers';
import {
  approveBooking,
  cancelBooking,
  createBooking,
  getBookings,
  rejectBooking,
} from '../services/api';
import { OccupancyIcon, PendingIcon, RevenueIcon, TrendUpIcon } from './utils/icons';
import { useToast, ToastContainer } from './components/Toast';
import { filterBookingsByDateRange, getDateRange } from './utils/dateHelpers';
import { useAuth } from '../contexts/AuthContext';

const metricCards = [
  {
    title: 'Total Bookings',
    icon: TrendUpIcon,
    accentClassName: 'bg-[#1D4ED8]',
    valueKey: 'totalBookings' as const,
    deltaKey: 'totalBookingsDelta' as const,
  },
  {
    title: 'Monthly Revenue',
    icon: RevenueIcon,
    accentClassName: 'bg-[#06B6D4]',
    valueKey: 'approvedRevenue' as const,
    deltaKey: 'approvedRevenueDelta' as const,
  },
  {
    title: 'Occupancy Rate',
    icon: OccupancyIcon,
    accentClassName: 'bg-[#10B981]',
    valueKey: 'occupancyRate' as const,
    deltaKey: 'occupancyRateDelta' as const,
  },
  {
    title: 'Pending Requests',
    icon: PendingIcon,
    accentClassName: 'bg-[#F59E0B]',
    valueKey: 'pendingRequests' as const,
    deltaKey: 'pendingRequestsDelta' as const,
  },
];

export default function BookingDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<unknown[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [period, setPeriod] = React.useState('weekly');
  const [dateRange, setDateRange] = React.useState('30days');
  const [modalOpen, setModalOpen] = React.useState(false);
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
      setError('Unable to load bookings. Ensure the Spring Boot API is running on port 8080.');
      setBookings([]);
      pushToast('error', ax?.response?.data?.message || 'Backend unavailable.');
    } finally {
      setLoading(false);
    }
  }, [pushToast, user?.id, user?.role]);

  React.useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const dateRangeData = getDateRange(dateRange);
  const filteredByDate = filterBookingsByDateRange(bookings, dateRangeData.start, dateRangeData.end);
  const metrics = React.useMemo(() => calculateMetrics(filteredByDate), [filteredByDate]);
  const filteredBookings = React.useMemo(
    () => filterBookings(filteredByDate, search),
    [filteredByDate, search]
  );

  const handleCreateBooking = async (formValues: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      await createBooking(buildSubmissionPayload(formValues));
      pushToast('success', 'Booking created successfully.');
      setModalOpen(false);
      await loadBookings();
    } catch (createError: unknown) {
      const ax = createError as { response?: { data?: { message?: string } } };
      const message =
        ax?.response?.data?.message || 'Booking creation failed. Please verify the form values.';
      pushToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const runAction = async (id: string, action: 'approve' | 'reject' | 'cancel') => {
    setActionLoadingId(id);
    try {
      if (action === 'approve') {
        await approveBooking(id);
        pushToast('success', `Booking #${id} approved.`);
      } else if (action === 'reject') {
        await rejectBooking(id);
        pushToast('success', `Booking #${id} rejected.`);
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
          <p className="text-sm font-medium text-[#9CA3AF]">{getGreeting()}</p>
          <h1 className="mt-1 text-2xl font-bold text-[#374151]">Booking Dashboard</h1>
          <p className="mt-2 text-[#9CA3AF]">Overview of reservations and approvals (Spring Boot API)</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="dash-range">
            Date range
          </label>
          <select
            id="dash-range"
            aria-label="Date range for dashboard metrics"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#374151] shadow-sm focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, resource, purpose, status..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-[#374151] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metricCards.map(({ title, icon, accentClassName, valueKey, deltaKey }) => {
              const rawValue = metrics[valueKey];
              const value =
                valueKey === 'approvedRevenue'
                  ? formatCurrency(rawValue)
                  : valueKey === 'occupancyRate'
                    ? `${rawValue}%`
                    : rawValue;
              return (
                <StatsCard
                  key={title}
                  title={title}
                  value={value}
                  delta={metrics[deltaKey]}
                  icon={icon}
                  accentClassName={accentClassName}
                />
              );
            })}
          </section>

          <ChartSection bookings={filteredByDate} period={period} onPeriodChange={setPeriod} />

          <section>
            {filteredBookings.length > 0 ? (
              <BookingTable
                bookings={filteredBookings}
                loading={false}
                onApprove={(id: string) => runAction(id, 'approve')}
                onReject={(id: string) => runAction(id, 'reject')}
                onCancel={(id: string) => runAction(id, 'cancel')}
                onRowClick={(booking: unknown) => {
                  setSelectedBooking(booking);
                  setDetailsModalOpen(true);
                }}
                actionLoadingId={actionLoadingId}
              />
            ) : (
              <div className="rounded-xl border border-gray-100 bg-white p-12 shadow-sm">
                <EmptyState title="No bookings found" description="Create a new booking to get started." />
              </div>
            )}
          </section>
        </>
      )}

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#1D4ED8] text-2xl font-light text-white shadow-lg transition hover:bg-[#1E40AF] hover:shadow-xl"
        aria-label="New booking"
      >
        +
      </button>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateBooking}
        submitting={submitting}
        defaultUserId={user?.id ?? ''}
      />

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
        actionLoading={actionLoadingId !== null}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
