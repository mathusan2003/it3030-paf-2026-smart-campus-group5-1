package com.sliit.bookingmodule.dto;

import com.sliit.bookingmodule.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TicketCreateRequest {
    @NotBlank
    private String createdByUserId;

    @NotBlank
    private String resourceId;

    @NotBlank
    private String location;

    @NotBlank
    private String category;

    @NotBlank
    private String description;

    @NotNull
    private TicketPriority priority;

    @NotBlank
    private String preferredContact;

    private List<String> attachments;
}
