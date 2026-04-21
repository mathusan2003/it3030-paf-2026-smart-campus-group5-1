package com.sliit.bookingmodule.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketComment {
    private String id;
    private String authorUserId;
    private String authorRole;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
