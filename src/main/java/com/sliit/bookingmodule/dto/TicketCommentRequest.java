package com.sliit.bookingmodule.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketCommentRequest {
    @NotBlank
    private String authorUserId;
    @NotBlank
    private String authorRole;
    @NotBlank
    private String message;
}
