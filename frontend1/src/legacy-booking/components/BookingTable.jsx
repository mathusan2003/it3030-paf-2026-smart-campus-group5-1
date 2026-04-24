import { CheckIcon, DotsIcon } from '../utils/icons';
import {
  STATUS_META,
  bookingDisplayName,
  bookingSubLabel,
  formatDateRange,
  formatRelativeDate,
} from '../utils/bookingHelpers';

function BookingTable({
  bookings,
  loading,
  onApprove,
  onCancel,
  onReject,
  onRequestCancel = (_id) => {},
  onRowClick,
  actionLoadingId,
  userRole = 'administrator',
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-5 w-44 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-[#374151]">Recent Reservations</h2>
          <p className="mt-1 text-sm text-[#9CA3AF]">Latest booking activity and approval actions</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
          Live updates
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-left">
          <thead className="bg-[#F9FAFB] text-[11px] uppercase tracking-wide text-[#9CA3AF]">
            <tr>
              <th className="px-6 py-3 font-semibold">Booking ID</th>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Dates</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length ? (
              bookings.map((booking) => {
                const meta = STATUS_META[booking.status] || STATUS_META.PENDING;
                const isAdmin = userRole === 'administrator';
                const isStudent = userRole === 'student';
                const adminCanDecide = isAdmin && (booking.status === 'PENDING' || booking.status === 'CANCEL_REQUESTED');
                const studentCanCancelPending = isStudent && booking.status === 'PENDING';
                const studentCanRequestCancel = isStudent && booking.status === 'APPROVED';

                return (
                  <tr key={booking.id} className="transition-colors hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4 align-middle">
                      <button
                        type="button"
                        onClick={() => onRowClick(booking)}
                        className="font-mono text-sm font-medium text-[#1D4ED8] hover:text-[#1E40AF]"
                      >
                        #BK-{booking.id}
                      </button>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#06B6D4] text-sm font-bold text-white">
                          {String(booking.userId || '?').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#374151]">{bookingDisplayName(booking)}</p>
                          <p className="text-xs text-[#9CA3AF]">{bookingSubLabel(booking)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div>
                        <p className="text-sm text-[#374151]">
                          {formatDateRange(booking.bookingDate, booking.bookingDate)}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">
                          {formatRelativeDate(booking.bookingDate)} · {booking.startTime?.slice(0, 5)} -{' '}
                          {booking.endTime?.slice(0, 5)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${meta.className}`}
                      >
                        {meta.label}
                      </span>
                      {isAdmin &&
                      (booking.status === 'CANCEL_REQUESTED' || booking.status === 'CANCELLED') &&
                      booking.cancelRequestReason ? (
                        <p className="mt-2 max-w-xs text-xs text-orange-700">
                          Reason: {booking.cancelRequestReason}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        {adminCanDecide ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onReject(booking.id)}
                              disabled={actionLoadingId === booking.id}
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-100 transition hover:bg-rose-100 disabled:opacity-50"
                              title="Reject booking"
                            >
                              ✕
                            </button>
                            <button
                              type="button"
                              onClick={() => onApprove(booking.id)}
                              disabled={actionLoadingId === booking.id}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100 transition hover:bg-emerald-100 disabled:opacity-50"
                              title="Approve booking"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          </>
                        ) : studentCanCancelPending ? (
                          <button
                            type="button"
                            onClick={() => onCancel(booking.id)}
                            disabled={actionLoadingId === booking.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-100 transition hover:bg-amber-100 disabled:opacity-50"
                            title="Cancel booking"
                          >
                            ⊘ Cancel
                          </button>
                        ) : studentCanRequestCancel ? (
                          <button
                            type="button"
                            onClick={() => onRequestCancel(booking.id)}
                            disabled={actionLoadingId === booking.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-800 ring-1 ring-orange-100 transition hover:bg-orange-100 disabled:opacity-50"
                            title="Request cancellation"
                          >
                            Request Cancel
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-[#9CA3AF]">
                            <DotsIcon className="h-4 w-4" />
                            Managed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <p className="text-base font-semibold text-[#374151]">No bookings found</p>
                  <p className="mt-2 text-sm text-[#9CA3AF]">Create a new booking to see activity appear here.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingTable;
