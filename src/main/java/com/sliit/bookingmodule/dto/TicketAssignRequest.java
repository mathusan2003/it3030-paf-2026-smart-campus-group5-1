package com.sliit.bookingmodule.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketAssignRequest {
    @NotBlank
    private String technicianUserId;
}
