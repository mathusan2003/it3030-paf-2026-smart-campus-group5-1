package com.sliit.bookingmodule.mysql.repository;

import com.sliit.bookingmodule.enums.BookingStatus;
import com.sliit.bookingmodule.mysql.entity.BookingJpa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingJpaRepository extends JpaRepository<BookingJpa, String> {

    @Query("""
            select b from BookingJpa b
            where b.resourceId = :resourceId
              and b.bookingDate = :bookingDate
              and b.status in :statuses
              and b.startTime < :endTime
              and b.endTime > :startTime
            """)
    List<BookingJpa> findConflicts(
            @Param("resourceId") String resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("statuses") List<BookingStatus> statuses,
            @Param("endTime") LocalTime endTime,
            @Param("startTime") LocalTime startTime
    );
}

