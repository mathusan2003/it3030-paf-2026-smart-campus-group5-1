import React from 'react';
import { CalendarIcon, CloseIcon, ClockIcon } from '../utils/icons';

const initialState = {
  userId: '',
  resourceId: '',
  bookingDate: '',
  startTime: '09:00',
  endTime: '11:00',
  purpose: '',
  expectedAttendees: '',
};

/**
 * @param {{
 *  open: boolean,
 *  onClose: () => void,
 *  onSubmit: (form: Record<string, unknown>) => Promise<unknown>,
 *  submitting: boolean,
 *  defaultUserId?: string,
 *  defaultResourceId?: string,
 *  resources?: Array<{id: string, name: string, type?: string, location?: string}>
 * }} props
 */
function BookingModal({ open, onClose, onSubmit, submitting, defaultUserId = '', defaultResourceId = '', resources = [] }) {
  const [form, setForm] = React.useState(initialState);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (open) {
      const today = new Date();
      const bookingDate = today.toISOString().slice(0, 10);
      setForm({
        ...initialState,
        bookingDate,
        userId: defaultUserId ? String(defaultUserId) : '',
        resourceId: defaultResourceId ? String(defaultResourceId) : '',
      });
      setErrors({});
    }
  }, [open, defaultUserId, defaultResourceId]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const typeLabel = (type) => {
    const labels = {
      LECTURE_HALL: 'Lecture Hall',
      LAB: 'Lab',
      MEETING_ROOM: 'Meeting Room',
      EQUIPMENT: 'Equipment',
    };
    return labels[type] || type || 'Resource';
  };

  const validate = () => {
    const nextErrors = {};
    if (!String(form.userId || '').trim()) nextErrors.userId = 'User ID is required';
    if (!String(form.resourceId || '').trim()) nextErrors.resourceId = 'Resource selection is required';
    if (!form.bookingDate) nextErrors.bookingDate = 'Booking date is required';
    if (!form.startTime) nextErrors.startTime = 'Start time is required';
    if (!form.endTime) nextErrors.endTime = 'End time is required';
    if (!form.purpose.trim()) nextErrors.purpose = 'Purpose is required';
    if (!form.expectedAttendees || Number(form.expectedAttendees) <= 0) nextErrors.expectedAttendees = 'Valid attendee count is required';
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      nextErrors.endTime = 'End time must be after start time';
    }

    const today = new Date().toISOString().split('T')[0];
    if (form.bookingDate && form.bookingDate < today) {
      nextErrors.bookingDate = 'Booking date must be today or later';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit(form);
      setForm(initialState);
    } catch (submitError) {
      return submitError;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl thin-scrollbar sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Create booking</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#374151]">New Booking Request</h3>
            <p className="mt-2 text-sm text-[#9CA3AF]">Submit a booking request to the Spring Boot API.</p>
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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            { name: 'userId', label: 'User ID', type: 'text', placeholder: 'student-1' },
            { name: 'bookingDate', label: 'Booking Date', type: 'date', icon: CalendarIcon },
            { name: 'expectedAttendees', label: 'Expected Attendees', type: 'number', placeholder: '24' },
          ].map(({ name, label, type, placeholder, icon: Icon }) => (
            <label key={name} className="grid gap-2 text-sm font-medium text-[#374151]">
              <span>{label}</span>
              <div className="relative">
                {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" /> : null}
                <input
                  type={type}
                  value={form[name]}
                  placeholder={placeholder}
                  onChange={(event) => updateField(name, event.target.value)}
                  className={`h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-[#374151] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 ${
                    Icon ? 'pl-10' : ''
                  } ${errors[name] ? 'border-rose-400' : ''}`}
                />
              </div>
              {errors[name] ? <span className="text-xs text-rose-600">{errors[name]}</span> : null}
            </label>
          ))}

          <label className="grid gap-2 text-sm font-medium text-[#374151]">
            <span>Resource</span>
            <select
              value={form.resourceId}
              onChange={(event) => updateField('resourceId', event.target.value)}
              className={`h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-[#374151] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 ${
                errors.resourceId ? 'border-rose-400' : ''
              }`}
            >
              <option value="">Select resource from catalog</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} - {typeLabel(resource.type)}
                  {resource.location ? ` @ ${resource.location}` : ''} ({resource.id})
                </option>
              ))}
            </select>
            {errors.resourceId ? <span className="text-xs text-rose-600">{errors.resourceId}</span> : null}
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#374151] md:col-span-2">
            <span>Purpose</span>
            <textarea
              value={form.purpose}
              onChange={(event) => updateField('purpose', event.target.value)}
              rows={4}
              placeholder="Describe the booking purpose"
              className={`resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#374151] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 ${
                errors.purpose ? 'border-rose-400' : ''
              }`}
            />
            {errors.purpose ? <span className="text-xs text-rose-600">{errors.purpose}</span> : null}
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#374151]">
            <span>Start Time</span>
            <div className="relative">
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="time"
                value={form.startTime}
                onChange={(event) => updateField('startTime', event.target.value)}
                className={`h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-[#374151] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 ${
                  errors.startTime ? 'border-rose-400' : ''
                }`}
              />
            </div>
            {errors.startTime ? <span className="text-xs text-rose-600">{errors.startTime}</span> : null}
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#374151]">
            <span>End Time</span>
            <div className="relative">
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="time"
                value={form.endTime}
                onChange={(event) => updateField('endTime', event.target.value)}
                className={`h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-[#374151] outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 ${
                  errors.endTime ? 'border-rose-400' : ''
                }`}
              />
            </div>
            {errors.endTime ? <span className="text-xs text-rose-600">{errors.endTime}</span> : null}
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Saving...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingModal;

