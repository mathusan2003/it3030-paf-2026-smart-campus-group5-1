package com.sliit.bookingmodule.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketCommentUpdateRequest {
    @NotBlank
    private String actorUserId;
    @NotBlank
    private String actorRole;
    @NotBlank
    private String message;
}
