export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const getLastNDays = (n) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - n);
  return getDatesInRange(startDate, today);
};

export const getDateRange = (period) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (period === '7days') {
    const start = new Date(today);
    start.setDate(today.getDate() - 7);
    return { start, end: today };
  } else if (period === '30days') {
    const start = new Date(today);
    start.setDate(today.getDate() - 30);
    return { start, end: today };
  } else if (period === '90days') {
    const start = new Date(today);
    start.setDate(today.getDate() - 90);
    return { start, end: today };
  }

  return { start: today, end: today };
};

export const filterBookingsByDateRange = (bookings, startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.bookingDate);
    return bookingDate >= start && bookingDate <= end;
  });
};
