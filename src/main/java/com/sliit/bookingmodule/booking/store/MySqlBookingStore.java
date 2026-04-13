package com.sliit.bookingmodule.booking.store;

import com.sliit.bookingmodule.entity.Booking;
import com.sliit.bookingmodule.enums.BookingStatus;
import com.sliit.bookingmodule.mysql.entity.BookingJpa;
import com.sliit.bookingmodule.mysql.repository.BookingJpaRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Profile("mysql")
public class MySqlBookingStore implements BookingStore {

    private final BookingJpaRepository bookingJpaRepository;

    public MySqlBookingStore(BookingJpaRepository bookingJpaRepository) {
        this.bookingJpaRepository = bookingJpaRepository;
    }

    @Override
    public Booking save(Booking booking) {
        BookingJpa saved = bookingJpaRepository.save(toJpa(booking));
        return fromJpa(saved);
    }

    @Override
    public Optional<Booking> findById(String id) {
        return bookingJpaRepository.findById(id).map(MySqlBookingStore::fromJpa);
    }

    @Override
    public List<Booking> findAllByCreatedAtDesc() {
        return bookingJpaRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(MySqlBookingStore::fromJpa)
                .toList();
    }

    @Override
    public List<Booking> findConflicts(String resourceId, LocalDate bookingDate, List<BookingStatus> statuses, LocalTime endTime, LocalTime startTime) {
        return bookingJpaRepository.findConflicts(resourceId, bookingDate, statuses, endTime, startTime)
                .stream()
                .map(MySqlBookingStore::fromJpa)
                .toList();
    }

    private static BookingJpa toJpa(Booking b) {
        BookingJpa jpa = new BookingJpa();
        jpa.setId(b.getId());
        jpa.setUserId(b.getUserId());
        jpa.setResourceId(b.getResourceId());
        jpa.setBookingDate(b.getBookingDate());
        jpa.setStartTime(b.getStartTime());
        jpa.setEndTime(b.getEndTime());
        jpa.setPurpose(b.getPurpose());
        jpa.setExpectedAttendees(b.getExpectedAttendees());
        jpa.setStatus(b.getStatus());
        jpa.setAdminReason(b.getAdminReason());
        jpa.setCreatedAt(b.getCreatedAt());
        jpa.setUpdatedAt(b.getUpdatedAt());
        return jpa;
    }

    private static Booking fromJpa(BookingJpa j) {
        Booking b = new Booking();
        b.setId(j.getId());
        b.setUserId(j.getUserId());
        b.setResourceId(j.getResourceId());
        b.setBookingDate(j.getBookingDate());
        b.setStartTime(j.getStartTime());
        b.setEndTime(j.getEndTime());
        b.setPurpose(j.getPurpose());
        b.setExpectedAttendees(j.getExpectedAttendees());
        b.setStatus(j.getStatus());
        b.setAdminReason(j.getAdminReason());
        b.setCreatedAt(j.getCreatedAt());
        b.setUpdatedAt(j.getUpdatedAt());
        return b;
    }
}

