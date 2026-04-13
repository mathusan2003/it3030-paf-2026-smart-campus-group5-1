package com.sliit.bookingmodule.booking.store;

import com.sliit.bookingmodule.entity.Booking;
import com.sliit.bookingmodule.enums.BookingStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface BookingStore {
    Booking save(Booking booking);

    Optional<Booking> findById(String id);

    List<Booking> findAllByCreatedAtDesc();

    List<Booking> findConflicts(
            String resourceId,
            LocalDate bookingDate,
            List<BookingStatus> statuses,
            LocalTime endTime,
            LocalTime startTime
    );
}

