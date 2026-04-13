package com.sliit.bookingmodule.dto;

import com.sliit.bookingmodule.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    @NotNull
    private TicketStatus status;
    private String reason;
    private String resolutionNotes;
}
