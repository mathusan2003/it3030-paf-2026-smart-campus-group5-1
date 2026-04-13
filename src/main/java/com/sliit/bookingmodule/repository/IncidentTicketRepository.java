package com.sliit.bookingmodule.repository;

import com.sliit.bookingmodule.entity.IncidentTicket;
import com.sliit.bookingmodule.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentTicketRepository extends MongoRepository<IncidentTicket, String> {
    List<IncidentTicket> findByCreatedByUserId(String createdByUserId);
    List<IncidentTicket> findByStatus(TicketStatus status);
}
