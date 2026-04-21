package com.sliit.bookingmodule.dto;

import com.sliit.bookingmodule.enums.ResourceStatus;
import com.sliit.bookingmodule.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class ResourceRequest {

    @NotBlank
    private String name;

    @NotNull
    private ResourceType type;

    @NotNull
    @Min(1)
    private Integer capacity;

    @NotBlank
    private String location;

    @NotNull
    private LocalTime availableFrom;

    @NotNull
    private LocalTime availableTo;

    @NotNull
    private ResourceStatus status;

    private String description;
}
