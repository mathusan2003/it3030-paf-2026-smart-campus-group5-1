//import
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const STATUS_META = {
  APPROVED: {
    label: 'APPROVED',
    className: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
  },
  CANCEL_REQUESTED: {
    label: 'CANCEL REQUESTED',
    className: 'bg-orange-50 text-orange-800 ring-1 ring-orange-200',
  },
  PENDING: {
    label: 'PENDING',
    className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
  },
  REJECTED: {
    label: 'REJECTED',
    className: 'bg-rose-50 text-rose-800 ring-1 ring-rose-200',
  },
  CANCELLED: {
    label: 'CANCELLED',
    className: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  },
};

export const formatCurrency = (value) => formatter.format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '--';
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} - ${end}`;
};

export const formatRelativeDate = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  const today = new Date();
  const diff = Math.floor((date.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} ago`;
  return `In ${diff} day${diff === 1 ? '' : 's'}`;
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning, ready to review today’s bookings?';
  if (hour < 18) return 'Good afternoon, your booking flow is moving smoothly.';
  return 'Good evening, you have a few requests waiting for approval tonight.';
};

const durationHours = (booking) => {
  if (!booking?.startTime || !booking?.endTime) return 1.5;
  const [startHour, startMinute] = booking.startTime.split(':').map(Number);
  const [endHour, endMinute] = booking.endTime.split(':').map(Number);
  const start = startHour + startMinute / 60;
  const end = endHour + endMinute / 60;
  const duration = end - start;
  return Number.isFinite(duration) && duration > 0 ? duration : 1.5;
};

export const estimateBookingValue = (booking) => {
  const base = 120;
  const attendeeValue = Number(booking?.expectedAttendees || 0) * 18;
  const durationValue = durationHours(booking) * 42;
  const resourceValue = (Number(booking?.resourceId || 0) % 5) * 25;
  return Math.round(base + attendeeValue + durationValue + resourceValue);
};

export const bookingDisplayName = (booking) => {
  if (!booking) return 'Unknown booking';
  return booking.userName || booking.user?.name || `User #${booking.userId ?? '--'}`;
};

export const bookingSubLabel = (booking) => {
  if (!booking) return '';
  const resourceName = booking.resourceName || booking.resource?.name || '--';
  return `Resource #${booking.resourceId ?? '--'} · ${resourceName}`;
};

const dateFromBooking = (booking) => {
  if (booking?.createdAt) {
    const created = new Date(booking.createdAt);
    if (!Number.isNaN(created.getTime())) return created;
  }
  if (booking?.bookingDate) {
    const bookingDate = new Date(booking.bookingDate);
    if (!Number.isNaN(bookingDate.getTime())) return bookingDate;
  }
  return null;
};

export const calculateMetrics = (bookings = []) => {
  const totalBookings = bookings.length;
  const pendingRequests = bookings.filter((booking) => booking.status === 'PENDING').length;
  const approvedBookings = bookings.filter((booking) => booking.status === 'APPROVED').length;
  const approvedRevenue = bookings
    .filter((booking) => booking.status === 'APPROVED')
    .reduce((sum, booking) => sum + estimateBookingValue(booking), 0);

  const occupancyRate = totalBookings ? Math.round((approvedBookings / totalBookings) * 1000) / 10 : 0;

  const now = new Date();
  const currentRangeStart = new Date(now);
  currentRangeStart.setDate(now.getDate() - 30);
  const previousRangeStart = new Date(now);
  previousRangeStart.setDate(now.getDate() - 60);

  const currentBookings = bookings.filter((booking) => {
    const date = dateFromBooking(booking);
    return date && date >= currentRangeStart;
  });

  const previousBookings = bookings.filter((booking) => {
    const date = dateFromBooking(booking);
    return date && date < currentRangeStart && date >= previousRangeStart;
  });

  const currentRevenue = currentBookings
    .filter((booking) => booking.status === 'APPROVED')
    .reduce((sum, booking) => sum + estimateBookingValue(booking), 0);

  const previousRevenue = previousBookings
    .filter((booking) => booking.status === 'APPROVED')
    .reduce((sum, booking) => sum + estimateBookingValue(booking), 0);

  const previousOccupancy = previousBookings.length
    ? Math.round(
        (previousBookings.filter((booking) => booking.status === 'APPROVED').length /
          previousBookings.length) *
          1000,
      ) / 10
    : 0;

  const previousPending = previousBookings.filter((booking) => booking.status === 'PENDING').length;

  const safeDelta = (current, previous) => {
    if (!previous) {
      return current > 0 ? '+100%' : '0%';
    }
    const delta = ((current - previous) / Math.max(previous, 1)) * 100;
    const rounded = Math.abs(delta) < 0.1 ? 0 : Math.round(delta * 10) / 10;
    return `${rounded > 0 ? '+' : ''}${rounded}%`;
  };

  return {
    totalBookings,
    totalBookingsDelta: safeDelta(currentBookings.length, previousBookings.length),
    approvedRevenue,
    approvedRevenueDelta: safeDelta(currentRevenue, previousRevenue),
    occupancyRate,
    occupancyRateDelta: safeDelta(occupancyRate, previousOccupancy),
    pendingRequests,
    pendingRequestsDelta: pendingRequests > previousPending ? 'New' : safeDelta(pendingRequests, previousPending),
  };
};

const getBucketLabel = (index, period) => {
  if (period === 'monthly') {
    const labels = ['W1', 'W2', 'W3', 'W4'];
    return labels[index] || `W${index + 1}`;
  }
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return labels[index] || `D${index + 1}`;
};

export const buildTrendSeries = (bookings = [], period = 'weekly') => {
  const bucketCount = period === 'monthly' ? 4 : 7;
  const buckets = Array.from({ length: bucketCount }, () => 0);
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (period === 'monthly' ? 28 : 6));

  bookings.forEach((booking) => {
    const date = dateFromBooking(booking);
    if (!date || date < startDate || date > today) return;
    const startValue = new Date(startDate);
    startValue.setHours(0, 0, 0, 0);
    const bookingValue = new Date(date);
    bookingValue.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((bookingValue - startValue) / 86400000);
    const bucketIndex = period === 'monthly' ? Math.min(3, Math.floor(diffDays / 7)) : Math.min(6, diffDays);
    if (bucketIndex >= 0 && bucketIndex < buckets.length) {
      buckets[bucketIndex] += 1;
    }
  });

  const max = Math.max(...buckets, 1);
  const widthStep = bucketCount > 1 ? 100 / (bucketCount - 1) : 100;
  const linePoints = buckets.map((value, index) => ({
    label: getBucketLabel(index, period),
    value,
    x: index * widthStep,
    y: 85 - (value / max) * 55,
  }));

  const path = linePoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return {
    buckets: linePoints,
    path,
    max,
    total: buckets.reduce((sum, value) => sum + value, 0),
  };
};

const resolveCategory = (booking) => {
  const purpose = String(booking?.purpose || '').toLowerCase();
  if (purpose.includes('dining') || purpose.includes('food') || purpose.includes('catering')) return 'Dining';
  if (purpose.includes('spa') || purpose.includes('wellness') || purpose.includes('massage')) return 'Spa';
  if (purpose.includes('event') || purpose.includes('conference') || purpose.includes('meeting')) return 'Events';
  return Number(booking?.resourceId || 0) % 3 === 0 ? 'Events' : 'Rooms';
};

export const buildRevenueBreakdown = (bookings = []) => {
  const categoryValues = {
    Rooms: 0,
    Dining: 0,
    Spa: 0,
    Events: 0,
  };

  bookings.forEach((booking) => {
    const category = resolveCategory(booking);
    categoryValues[category] += estimateBookingValue(booking);
  });

  const total = Object.values(categoryValues).reduce((sum, value) => sum + value, 0) || 1;
  const palette = {
    Rooms: 'from-emerald-400 to-lime-300',
    Dining: 'from-cyan-400 to-sky-300',
    Spa: 'from-violet-400 to-fuchsia-300',
    Events: 'from-slate-400 to-slate-500',
  };

  return Object.entries(categoryValues).map(([label, value]) => ({
    label,
    value,
    total,
    percentage: Math.round((value / total) * 100),
    className: palette[label],
  }));
};

export const filterBookings = (bookings = [], term = '') => {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return bookings;
  return bookings.filter((booking) => {
    const parts = [
      `#${booking.id}`,
      booking.userId,
      booking.resourceId,
      booking.purpose,
      booking.status,
      booking.bookingDate,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return parts.includes(normalized);
  });
};

export const buildSubmissionPayload = (formValues) => ({
  userId: String(formValues.userId),
  resourceId: String(formValues.resourceId),
  bookingDate: formValues.bookingDate,
  startTime: formValues.startTime,
  endTime: formValues.endTime,
  purpose: formValues.purpose,
  expectedAttendees: Number(formValues.expectedAttendees),
});
