package com.sliit.bookingmodule.service;

import com.sliit.bookingmodule.dto.TicketCommentRequest;
import com.sliit.bookingmodule.dto.TicketCreateRequest;
import com.sliit.bookingmodule.dto.TicketStatusUpdateRequest;
import com.sliit.bookingmodule.entity.IncidentTicket;
import com.sliit.bookingmodule.entity.TicketComment;
import com.sliit.bookingmodule.enums.TicketStatus;
import com.sliit.bookingmodule.notifications.sms.SmsNotificationSender;
import com.sliit.bookingmodule.repository.IncidentTicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final IncidentTicketRepository incidentTicketRepository;
    private final NotificationService notificationService;
    private final SmsNotificationSender smsNotificationSender;

    public TicketService(IncidentTicketRepository incidentTicketRepository, NotificationService notificationService, SmsNotificationSender smsNotificationSender) {
        this.incidentTicketRepository = incidentTicketRepository;
        this.notificationService = notificationService;
        this.smsNotificationSender = smsNotificationSender;
    }

    public IncidentTicket createTicket(TicketCreateRequest request) {
        IncidentTicket ticket = new IncidentTicket();
        ticket.setCreatedByUserId(request.getCreatedByUserId());
        ticket.setResourceId(request.getResourceId());
        ticket.setLocation(request.getLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setAttachments(validateAttachments(request.getAttachments()));
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setComments(new ArrayList<>());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        IncidentTicket saved = incidentTicketRepository.save(ticket);

        notificationService.createNotification(
                saved.getCreatedByUserId(),
                "Ticket Created",
                "Your ticket has been created with status OPEN",
                "TICKET",
                saved.getId()
        );
        if (looksLikePhone(request.getPreferredContact())) {
            smsNotificationSender.sendDirectIfConfigured(request.getPreferredContact(), "Ticket Created: Your ticket is OPEN (" + saved.getId() + ")");
        }
        return saved;
    }

    public List<IncidentTicket> getTickets(String createdByUserId, TicketStatus status) {
        List<IncidentTicket> tickets = incidentTicketRepository.findAll();
        return tickets.stream()
                .filter(t -> createdByUserId == null || createdByUserId.isBlank() || createdByUserId.equals(t.getCreatedByUserId()))
                .filter(t -> status == null || status == t.getStatus())
                .toList();
    }

    public IncidentTicket getTicketById(String id) {
        return incidentTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public IncidentTicket assignTechnician(String id, String technicianUserId) {
        IncidentTicket ticket = getTicketById(id);
        if (ticket.getStatus() == TicketStatus.RESOLVED || ticket.getStatus() == TicketStatus.CLOSED) {
            throw new RuntimeException("Cannot assign technician to RESOLVED or CLOSED tickets");
        }
        ticket.setAssignedTechnicianUserId(technicianUserId);
        ticket.setUpdatedAt(LocalDateTime.now());
        IncidentTicket saved = incidentTicketRepository.save(ticket);
        notificationService.createNotification(
                saved.getCreatedByUserId(),
                "Technician Assigned",
                "A technician has been assigned to your ticket",
                "TICKET",
                saved.getId()
        );
        notificationService.createNotification(
                technicianUserId,
                "Ticket Assigned",
                "A ticket has been assigned to you",
                "TICKET",
                saved.getId()
        );
        return saved;
    }

    public IncidentTicket updateTicketStatus(String id, TicketStatusUpdateRequest request) {
        IncidentTicket ticket = getTicketById(id);
        ticket.setStatus(request.getStatus());
        if (request.getStatus() == TicketStatus.REJECTED) {
            ticket.setRejectReason(request.getReason());
        }
        if (request.getStatus() == TicketStatus.RESOLVED || request.getStatus() == TicketStatus.CLOSED) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        IncidentTicket saved = incidentTicketRepository.save(ticket);
        notificationService.createNotification(
                saved.getCreatedByUserId(),
                "Ticket Status Updated",
                "Ticket status changed to " + saved.getStatus(),
                "TICKET",
                saved.getId()
        );
        return saved;
    }

    public IncidentTicket addComment(String ticketId, TicketCommentRequest request) {
        IncidentTicket ticket = getTicketById(ticketId);
        TicketComment comment = new TicketComment(
                UUID.randomUUID().toString(),
                request.getAuthorUserId(),
                request.getAuthorRole(),
                request.getMessage(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());
        IncidentTicket saved = incidentTicketRepository.save(ticket);
        notificationService.createNotification(
                saved.getCreatedByUserId(),
                "New Ticket Comment",
                "A new comment was added to your ticket",
                "TICKET",
                saved.getId()
        );
        return saved;
    }

    public IncidentTicket updateComment(String ticketId, String commentId, String actorUserId, String actorRole, String message) {
        IncidentTicket ticket = getTicketById(ticketId);
        TicketComment comment = findComment(ticket, commentId);
        validateCommentPermission(comment, actorUserId, actorRole);
        comment.setMessage(message);
        comment.setUpdatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return incidentTicketRepository.save(ticket);
    }

    public IncidentTicket deleteComment(String ticketId, String commentId, String actorUserId, String actorRole) {
        IncidentTicket ticket = getTicketById(ticketId);
        TicketComment comment = findComment(ticket, commentId);
        validateCommentPermission(comment, actorUserId, actorRole);
        ticket.getComments().removeIf(c -> c.getId().equals(commentId));
        ticket.setUpdatedAt(LocalDateTime.now());
        return incidentTicketRepository.save(ticket);
    }

    private List<String> validateAttachments(List<String> attachments) {
        if (attachments == null) {
            return new ArrayList<>();
        }
        if (attachments.size() > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed");
        }
        return attachments;
    }

    private boolean looksLikePhone(String value) {
        if (value == null) {
            return false;
        }
        String trimmed = value.trim();
        if (trimmed.isBlank()) {
            return false;
        }
        if (trimmed.startsWith("+")) {
            trimmed = trimmed.substring(1);
        }
        return trimmed.chars().allMatch(Character::isDigit) && trimmed.length() >= 9;
    }

    private TicketComment findComment(IncidentTicket ticket, String commentId) {
        return ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    private void validateCommentPermission(TicketComment comment, String actorUserId, String actorRole) {
        boolean isOwner = comment.getAuthorUserId().equals(actorUserId);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(actorRole);
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You are not allowed to modify this comment");
        }
    }
}
