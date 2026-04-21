package com.sliit.bookingmodule.controller;

import com.sliit.bookingmodule.dto.ResourceRequest;
import com.sliit.bookingmodule.entity.Resource;
import com.sliit.bookingmodule.enums.ResourceStatus;
import com.sliit.bookingmodule.enums.ResourceType;
import com.sliit.bookingmodule.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Resource createResource(@Valid @RequestBody ResourceRequest request) {
        return resourceService.createResource(request);
    }

    @GetMapping
    public List<Resource> getResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status
    ) {
        return resourceService.getResources(type, minCapacity, location, status);
    }

    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable String id) {
        return resourceService.getResourceById(id);
    }

    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable String id, @Valid @RequestBody ResourceRequest request) {
        return resourceService.updateResource(id, request);
    }

    @PatchMapping("/{id}/status")
    public Resource updateStatus(@PathVariable String id, @RequestParam ResourceStatus status) {
        return resourceService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
    }
}
