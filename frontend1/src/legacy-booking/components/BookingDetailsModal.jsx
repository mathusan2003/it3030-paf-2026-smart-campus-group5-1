import React from 'react';
import { CloseIcon } from '../utils/icons';
import { formatDate } from '../utils/bookingHelpers';
import { STATUS_META } from '../utils/bookingHelpers';

function BookingDetailsModal({
  booking,
  open,
  onClose,
  onApprove,
  onReject,
  onCancel,
  onRequestCancel = (_id) => {},
  actionLoading,
  userRole = 'administrator',
}) {
  if (!open || !booking) return null;

  const meta = STATUS_META[booking.status] || STATUS_META.PENDING;
  const isAdmin = userRole === 'administrator';
  const isStudent = userRole === 'student';
  const adminCanManage = isAdmin && (booking.status === 'PENDING' || booking.status === 'CANCEL_REQUESTED');
  const studentCanCancel = isStudent && booking.status === 'PENDING';
  const studentCanRequestCancel = isStudent && booking.status === 'APPROVED';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl thin-scrollbar sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Booking Details</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#374151]">#{booking.id}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-[#9CA3AF] transition hover:bg-gray-50 hover:text-[#374151]"
            aria-label="Close modal"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-[#F9FAFB] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">User Information</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-[#374151]">
                  <span className="text-[#9CA3AF]">User ID:</span>{' '}
                  <span className="font-semibold">{booking.userId}</span>
                </p>
                <p className="text-sm text-[#374151]">
                  <span className="text-[#9CA3AF]">Resource ID:</span>{' '}
                  <span className="font-semibold">{booking.resourceId}</span>
                </p>
                <p className="text-sm text-[#374151]">
                  <span className="text-[#9CA3AF]">Expected Attendees:</span>{' '}
                  <span className="font-semibold">{booking.expectedAttendees}</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F9FAFB] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Booking Time</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-[#374151]">
                  <span className="text-[#9CA3AF]">Date:</span>{' '}
                  <span className="font-semibold">{formatDate(booking.bookingDate)}</span>
                </p>
                <p className="text-sm text-[#374151]">
                  <span className="text-[#9CA3AF]">Start Time:</span>{' '}
                  <span className="font-semibold">{booking.startTime}</span>
                </p>
                <p className="text-sm text-[#374151]">
                  <span className="text-[#9CA3AF]">End Time:</span>{' '}
                  <span className="font-semibold">{booking.endTime}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-[#F9FAFB] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Status</p>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold tracking-wide ${meta.className}`}
                >
                  {meta.label}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F9FAFB] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Additional Info</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-[#374151]">
                  <span className="text-[#9CA3AF]">Created:</span>{' '}
                  <span className="font-semibold">{formatDate(booking.createdAt)}</span>
                </p>
                {booking.updatedAt && (
                  <p className="text-sm text-[#374151]">
                    <span className="text-[#9CA3AF]">Updated:</span>{' '}
                    <span className="font-semibold">{formatDate(booking.updatedAt)}</span>
                  </p>
                )}
                {booking.cancelRequestReason && (
                  <p className="text-sm text-[#374151]">
                    <span className="text-[#9CA3AF]">Cancel Request Reason:</span>{' '}
                    <span className="font-semibold">{booking.cancelRequestReason}</span>
                  </p>
                )}
                {booking.adminReason && (
                  <p className="text-sm text-[#374151]">
                    <span className="text-[#9CA3AF]">Admin Reason:</span>{' '}
                    <span className="font-semibold">{booking.adminReason}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-100 bg-[#F9FAFB] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Booking Purpose</p>
          <p className="mt-3 text-sm text-[#374151]">{booking.purpose}</p>
        </div>

        {(adminCanManage || studentCanCancel || studentCanRequestCancel) && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-gray-50"
            >
              Close
            </button>
            {adminCanManage && (
              <>
                <button
                  type="button"
                  onClick={() => onReject(booking.id)}
                  disabled={actionLoading}
                  className="rounded-lg bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-100 transition hover:bg-rose-100 disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Reject'}
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(booking.id)}
                  disabled={actionLoading}
                  className="rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E40AF] disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Approve'}
                </button>
              </>
            )}
            {studentCanCancel && (
              <button
                type="button"
                onClick={() => onCancel(booking.id)}
                disabled={actionLoading}
                className="rounded-lg bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-800 ring-1 ring-amber-100 transition hover:bg-amber-100 disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Cancel'}
              </button>
            )}
            {studentCanRequestCancel && (
              <button
                type="button"
                onClick={() => onRequestCancel(booking.id)}
                disabled={actionLoading}
                className="rounded-lg bg-orange-50 px-5 py-2.5 text-sm font-semibold text-orange-800 ring-1 ring-orange-100 transition hover:bg-orange-100 disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Request Cancel'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingDetailsModal;
