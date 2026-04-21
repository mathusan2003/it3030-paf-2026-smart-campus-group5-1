package com.sliit.bookingmodule.service;

import com.sliit.bookingmodule.booking.store.BookingStore;
import com.sliit.bookingmodule.dto.BookingRequest;
import com.sliit.bookingmodule.entity.Booking;
import com.sliit.bookingmodule.entity.Resource;
import com.sliit.bookingmodule.enums.BookingStatus;
import com.sliit.bookingmodule.enums.ResourceStatus;
import com.sliit.bookingmodule.repository.ResourceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class BookingService {

    private final BookingStore bookingStore;
    private final NotificationService notificationService;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingStore bookingStore, NotificationService notificationService, ResourceRepository resourceRepository) {
        this.bookingStore = bookingStore;
        this.notificationService = notificationService;
        this.resourceRepository = resourceRepository;
    }

    public Booking createBooking(BookingRequest request) {
        log.info("Creating booking for userId: {}, resourceId: {}", request.getUserId(), request.getResourceId());
        validateResourceForBooking(request.getResourceId());
        validateTimeRange(request);
        validateBookingConflict(request.getResourceId(), request.getBookingDate(), request.getStartTime(), request.getEndTime());

        Booking booking = new Booking();
        booking.setId(UUID.randomUUID().toString());
        booking.setUserId(request.getUserId());
        booking.setResourceId(request.getResourceId());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingStore.save(booking);
        notificationService.createNotification(
                savedBooking.getUserId(),
                "Booking Submitted",
                "Your booking request is now pending admin approval",
                "BOOKING",
                savedBooking.getId()
        );
        log.info("Booking created successfully with id: {}", savedBooking.getId());
        return savedBooking;
    }

    public List<Booking> getBookings(String userId, BookingStatus status, boolean adminView) {
        log.info("Fetching bookings userId: {}, status: {}, adminView: {}", userId, status, adminView);
        List<Booking> bookings = bookingStore.findAllByCreatedAtDesc();
        return bookings.stream()
                .filter(b -> adminView || userId == null || userId.isBlank() || userId.equals(b.getUserId()))
                .filter(b -> status == null || status == b.getStatus())
                .toList();
    }

    public Booking approveBooking(String id) {
        log.info("Approving booking with id: {}", id);
        Booking booking = bookingStore.findById(id)
                .orElseThrow(() -> {
                    log.error("Booking not found with id: {}", id);
                    return new RuntimeException("Booking not found");
                });

        if (booking.getStatus() == BookingStatus.CANCEL_REQUESTED) {
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setUpdatedAt(LocalDateTime.now());
            booking.setAdminReason(null);
            Booking updated = bookingStore.save(booking);
            notificationService.createNotification(
                    updated.getUserId(),
                    "Cancellation Approved",
                    "Your cancellation request has been approved",
                    "BOOKING",
                    updated.getId()
            );
            log.info("Cancellation approved for booking id: {}", id);
            return updated;
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING or CANCEL_REQUESTED bookings can be approved");
        }
        validateBookingConflict(booking.getResourceId(), booking.getBookingDate(), booking.getStartTime(), booking.getEndTime(), id);

        booking.setStatus(BookingStatus.APPROVED);
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setAdminReason(null);
        booking.setCancelRequestReason(null);

        Booking updated = bookingStore.save(booking);
        notificationService.createNotification(
                updated.getUserId(),
                "Booking Approved",
                "Your booking has been approved",
                "BOOKING",
                updated.getId()
        );
        log.info("Booking approved successfully with id: {}", id);
        return updated;
    }

    public Booking rejectBooking(String id, String reason) {
        log.info("Rejecting booking with id: {}", id);
        Booking booking = bookingStore.findById(id)
                .orElseThrow(() -> {
                    log.error("Booking not found with id: {}", id);
                    return new RuntimeException("Booking not found");
                });
        if (booking.getStatus() == BookingStatus.CANCEL_REQUESTED) {
            booking.setStatus(BookingStatus.APPROVED);
            booking.setAdminReason(reason);
            booking.setCancelRequestReason(null);
            booking.setUpdatedAt(LocalDateTime.now());

            Booking updated = bookingStore.save(booking);
            notificationService.createNotification(
                    updated.getUserId(),
                    "Cancellation Request Rejected",
                    "Your cancellation request was rejected. Reason: " + reason,
                    "BOOKING",
                    updated.getId()
            );
            log.info("Cancellation request rejected for booking id: {}", id);
            return updated;
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING or CANCEL_REQUESTED bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminReason(reason);
        booking.setCancelRequestReason(null);
        booking.setUpdatedAt(LocalDateTime.now());

        Booking updated = bookingStore.save(booking);
        notificationService.createNotification(
                updated.getUserId(),
                "Booking Rejected",
                "Your booking was rejected. Reason: " + reason,
                "BOOKING",
                updated.getId()
        );
        log.info("Booking rejected successfully with id: {}", id);
        return updated;
    }

    public Booking cancelBooking(String id) {
        log.info("Cancelling booking with id: {}", id);
        Booking booking = bookingStore.findById(id)
                .orElseThrow(() -> {
                    log.error("Booking not found with id: {}", id);
                    return new RuntimeException("Booking not found");
                });
        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only APPROVED or PENDING bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelRequestReason(null);
        booking.setUpdatedAt(LocalDateTime.now());

        Booking updated = bookingStore.save(booking);
        notificationService.createNotification(
                updated.getUserId(),
                "Booking Cancelled",
                "Your booking has been cancelled",
                "BOOKING",
                updated.getId()
        );
        log.info("Booking cancelled successfully with id: {}", id);
        return updated;
    }

    public Booking requestCancelBooking(String id, String reason) {
        log.info("Requesting cancellation for booking id: {}", id);
        Booking booking = bookingStore.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED bookings can request cancellation");
        }
        booking.setStatus(BookingStatus.CANCEL_REQUESTED);
        booking.setCancelRequestReason(reason);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking updated = bookingStore.save(booking);
        notificationService.createNotification(
                updated.getUserId(),
                "Cancellation Requested",
                "Your cancellation request was sent for admin review",
                "BOOKING",
                updated.getId()
        );
        return updated;
    }

    private void validateTimeRange(BookingRequest request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new RuntimeException("Start time must be before end time");
        }
    }

    private void validateResourceForBooking(String resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Selected resource does not exist in Resource Catalog"));
        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new RuntimeException("Selected resource is not available for booking");
        }
    }

    private void validateBookingConflict(String resourceId, java.time.LocalDate bookingDate, java.time.LocalTime startTime, java.time.LocalTime endTime) {
        validateBookingConflict(resourceId, bookingDate, startTime, endTime, null);
    }

    private void validateBookingConflict(String resourceId, java.time.LocalDate bookingDate, java.time.LocalTime startTime, java.time.LocalTime endTime, String ignoreId) {
        List<Booking> conflicts = bookingStore.findConflicts(
                resourceId,
                bookingDate,
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED),
                endTime,
                startTime
        );
        boolean hasConflict = conflicts.stream().anyMatch(b -> ignoreId == null || !b.getId().equals(ignoreId));
        if (hasConflict) {
            throw new RuntimeException("Scheduling conflict detected for the selected resource and timeslot");
        }
    }
}