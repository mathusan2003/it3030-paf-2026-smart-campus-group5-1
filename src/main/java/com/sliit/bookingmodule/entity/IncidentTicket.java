package com.sliit.bookingmodule.entity;

import com.sliit.bookingmodule.enums.TicketPriority;
import com.sliit.bookingmodule.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "incident_tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicket {

    @Id
    private String id;

    private String createdByUserId;
    private String resourceId;
    private String location;
    private String category;
    private String description;
    private TicketPriority priority;
    private String preferredContact;
    private List<String> attachments = new ArrayList<>();

    private TicketStatus status;
    private String rejectReason;
    private String resolutionNotes;
    private String assignedTechnicianUserId;

    private List<TicketComment> comments = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
