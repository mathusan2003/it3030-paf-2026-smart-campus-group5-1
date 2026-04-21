package com.sliit.bookingmodule.controller;

import com.sliit.bookingmodule.dto.BookingRequest;
import com.sliit.bookingmodule.dto.CancelRequest;
import com.sliit.bookingmodule.dto.RejectRequest;
import com.sliit.bookingmodule.entity.Booking;
import com.sliit.bookingmodule.enums.BookingStatus;
import com.sliit.bookingmodule.service.BookingService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createBooking(@Valid @RequestBody BookingRequest request) {
        log.info("POST /api/bookings - Creating new booking");
        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<Booking> getBookings(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(defaultValue = "false") boolean adminView
    ) {
        log.info("GET /api/bookings - Fetching bookings");
        return bookingService.getBookings(userId, status, adminView);
    }

    @PatchMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable String id) {
        log.info("PATCH /api/bookings/{}/approve - Approving booking", id);
        return bookingService.approveBooking(id);
    }

    @PatchMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable String id, @Valid @RequestBody RejectRequest request) {
        log.info("PATCH /api/bookings/{}/reject - Rejecting booking", id);
        return bookingService.rejectBooking(id, request.getReason());
    }

    @PatchMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable String id) {
        log.info("PATCH /api/bookings/{}/cancel - Cancelling booking", id);
        return bookingService.cancelBooking(id);
    }

    @PatchMapping("/{id}/cancel-request")
    public Booking requestCancelBooking(@PathVariable String id, @Valid @RequestBody CancelRequest request) {
        log.info("PATCH /api/bookings/{}/cancel-request - Requesting cancellation", id);
        return bookingService.requestCancelBooking(id, request.getReason());
    }
}