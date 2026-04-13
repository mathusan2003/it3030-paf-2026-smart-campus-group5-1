package com.sliit.bookingmodule.service;

import com.sliit.bookingmodule.dto.ResourceRequest;
import com.sliit.bookingmodule.entity.Resource;
import com.sliit.bookingmodule.enums.ResourceStatus;
import com.sliit.bookingmodule.enums.ResourceType;
import com.sliit.bookingmodule.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public Resource createResource(ResourceRequest request) {
        Resource resource = new Resource();
        mapResourceFields(resource, request);
        resource.setCreatedAt(LocalDateTime.now());
        resource.setUpdatedAt(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, ResourceRequest request) {
        Resource resource = getResourceById(id);
        mapResourceFields(resource, request);
        resource.setUpdatedAt(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    public List<Resource> getResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status) {
        List<Resource> resources = resourceRepository.findAll();
        return resources.stream()
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> minCapacity == null || (r.getCapacity() != null && r.getCapacity() >= minCapacity))
                .filter(r -> location == null || location.isBlank() || (r.getLocation() != null && r.getLocation().toLowerCase().contains(location.toLowerCase())))
                .filter(r -> status == null || r.getStatus() == status)
                .toList();
    }

    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public Resource updateStatus(String id, ResourceStatus status) {
        Resource resource = getResourceById(id);
        resource.setStatus(status);
        resource.setUpdatedAt(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    public void deleteResource(String id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }

    private void mapResourceFields(Resource resource, ResourceRequest request) {
        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setAvailableFrom(request.getAvailableFrom());
        resource.setAvailableTo(request.getAvailableTo());
        resource.setStatus(request.getStatus());
        resource.setDescription(request.getDescription());
    }
}
