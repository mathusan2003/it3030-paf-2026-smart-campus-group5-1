import React from 'react';

// Import icons
import { CalendarIcon, CloseIcon, ClockIcon } from '../utils/icons';

// Initial form state (default values)
const initialState = {
  userId: '',
  resourceId: '',
  bookingDate: '',
  startTime: '09:00',
  endTime: '11:00',
  purpose: '',
  expectedAttendees: '',
};

function BookingModal({
  open,
  onClose,
  onSubmit,
  submitting,
  defaultUserId = '',
  defaultResourceId = '',
  resources = [],
}) {
  // Form state
  const [form, setForm] = React.useState(initialState);

  // Error state
  const [errors, setErrors] = React.useState({});

  // Reset form when modal opens
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

  // Close modal when ESC key pressed
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && open) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Update input fields
  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));

    // Remove error when user types
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  // Convert resource type to readable label
  const typeLabel = (type) => {
    const labels = {
      LECTURE_HALL: 'Lecture Hall',
      LAB: 'Lab',
      MEETING_ROOM: 'Meeting Room',
      EQUIPMENT: 'Equipment',
    };
    return labels[type] || type || 'Resource';
  };

  // Validate form inputs
  const validate = () => {
    const nextErrors = {};

    if (!form.userId.trim()) nextErrors.userId = 'User ID is required';
    if (!form.resourceId.trim()) nextErrors.resourceId = 'Resource required';
    if (!form.bookingDate) nextErrors.bookingDate = 'Date required';
    if (!form.startTime) nextErrors.startTime = 'Start time required';
    if (!form.endTime) nextErrors.endTime = 'End time required';
    if (!form.purpose.trim()) nextErrors.purpose = 'Purpose required';

    if (!form.expectedAttendees || Number(form.expectedAttendees) <= 0) {
      nextErrors.expectedAttendees = 'Valid attendees required';
    }

    // Check time logic
    if (form.startTime >= form.endTime) {
      nextErrors.endTime = 'End must be after start';
    }

    // Check past date
    const today = new Date().toISOString().split('T')[0];
    if (form.bookingDate < today) {
      nextErrors.bookingDate = 'Cannot select past date';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // Submit form
  const submit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit(form); // send data to backend
      setForm(initialState); // reset form
    } catch (err) {
      console.error(err);
    }
  };

  // Do not render if modal closed
  if (!open) return null;

  return (
    // Modal background
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal form */}
      <form
        onSubmit={submit}
        className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
      >

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold">New Booking</h3>
            <p className="text-sm text-gray-500">
              Create a booking request
            </p>
          </div>

          {/* Close button */}
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Form fields */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">

          {/* User ID */}
          <input
            placeholder="User ID"
            value={form.userId}
            onChange={(e) => updateField('userId', e.target.value)}
          />
          {errors.userId && <p>{errors.userId}</p>}

          {/* Booking Date */}
          <input
            type="date"
            value={form.bookingDate}
            onChange={(e) => updateField('bookingDate', e.target.value)}
          />
          {errors.bookingDate && <p>{errors.bookingDate}</p>}

          {/* Resource Select */}
          <select
            value={form.resourceId}
            onChange={(e) => updateField('resourceId', e.target.value)}
          >
            <option value="">Select Resource</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({typeLabel(r.type)})
              </option>
            ))}
          </select>
          {errors.resourceId && <p>{errors.resourceId}</p>}

          {/* Attendees */}
          <input
            type="number"
            placeholder="Attendees"
            value={form.expectedAttendees}
            onChange={(e) => updateField('expectedAttendees', e.target.value)}
          />
          {errors.expectedAttendees && <p>{errors.expectedAttendees}</p>}

          {/* Purpose */}
          <textarea
            placeholder="Purpose"
            value={form.purpose}
            onChange={(e) => updateField('purpose', e.target.value)}
          />
          {errors.purpose && <p>{errors.purpose}</p>}

          {/* Start Time */}
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => updateField('startTime', e.target.value)}
          />

          {/* End Time */}
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => updateField('endTime', e.target.value)}
          />
          {errors.endTime && <p>{errors.endTime}</p>}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose}>
            Cancel
          </button>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Create'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default BookingModal;