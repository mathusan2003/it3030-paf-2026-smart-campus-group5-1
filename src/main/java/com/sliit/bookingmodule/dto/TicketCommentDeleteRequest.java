package com.sliit.bookingmodule.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketCommentDeleteRequest {
    @NotBlank
    private String actorUserId;
    @NotBlank
    private String actorRole;
}
