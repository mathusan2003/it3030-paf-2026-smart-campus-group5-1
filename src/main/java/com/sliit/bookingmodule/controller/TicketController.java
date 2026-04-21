package com.sliit.bookingmodule.controller;

import com.sliit.bookingmodule.dto.*;
import com.sliit.bookingmodule.entity.IncidentTicket;
import com.sliit.bookingmodule.enums.TicketStatus;
import com.sliit.bookingmodule.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentTicket createTicket(@Valid @RequestBody TicketCreateRequest request) {
        return ticketService.createTicket(request);
    }

    @GetMapping
    public List<IncidentTicket> getTickets(
            @RequestParam(required = false) String createdByUserId,
            @RequestParam(required = false) TicketStatus status
    ) {
        return ticketService.getTickets(createdByUserId, status);
    }

    @GetMapping("/{id}")
    public IncidentTicket getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id);
    }

    @PatchMapping("/{id}/assign")
    public IncidentTicket assignTechnician(@PathVariable String id, @Valid @RequestBody TicketAssignRequest request) {
        return ticketService.assignTechnician(id, request.getTechnicianUserId());
    }

    @PatchMapping("/{id}/status")
    public IncidentTicket updateStatus(@PathVariable String id, @Valid @RequestBody TicketStatusUpdateRequest request) {
        return ticketService.updateTicketStatus(id, request);
    }

    @PostMapping("/{id}/comments")
    public IncidentTicket addComment(@PathVariable String id, @Valid @RequestBody TicketCommentRequest request) {
        return ticketService.addComment(id, request);
    }

    @PatchMapping("/{id}/comments/{commentId}")
    public IncidentTicket updateComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @Valid @RequestBody TicketCommentUpdateRequest request
    ) {
        return ticketService.updateComment(
                id, commentId, request.getActorUserId(), request.getActorRole(), request.getMessage()
        );
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public IncidentTicket deleteComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @Valid @RequestBody TicketCommentDeleteRequest request
    ) {
        return ticketService.deleteComment(id, commentId, request.getActorUserId(), request.getActorRole());
    }
}
