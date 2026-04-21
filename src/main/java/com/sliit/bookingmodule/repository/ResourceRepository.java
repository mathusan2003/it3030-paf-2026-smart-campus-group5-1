package com.sliit.bookingmodule.repository;

import com.sliit.bookingmodule.entity.Resource;
import com.sliit.bookingmodule.enums.ResourceStatus;
import com.sliit.bookingmodule.enums.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByType(ResourceType type);
    List<Resource> findByTypeAndCapacityGreaterThanEqualAndLocationContainingIgnoreCaseAndStatus(
            ResourceType type, Integer capacity, String location, ResourceStatus status);
    List<Resource> findByCapacityGreaterThanEqualAndLocationContainingIgnoreCase(Integer capacity, String location);
}
