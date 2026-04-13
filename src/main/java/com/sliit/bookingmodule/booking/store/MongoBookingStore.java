package com.sliit.bookingmodule.booking.store;

import com.sliit.bookingmodule.entity.Booking;
import com.sliit.bookingmodule.enums.BookingStatus;
import com.sliit.bookingmodule.repository.BookingRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Profile("!mysql")
public class MongoBookingStore implements BookingStore {

    private final BookingRepository bookingRepository;

    public MongoBookingStore(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public Optional<Booking> findById(String id) {
        return bookingRepository.findById(id);
    }

    @Override
    public List<Booking> findAllByCreatedAtDesc() {
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Override
    public List<Booking> findConflicts(String resourceId, LocalDate bookingDate, List<BookingStatus> statuses, LocalTime endTime, LocalTime startTime) {
        return bookingRepository.findByResourceIdAndBookingDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                resourceId,
                bookingDate,
                statuses,
                endTime,
                startTime
        );
    }
}

