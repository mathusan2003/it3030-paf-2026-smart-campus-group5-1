package com.sliit.bookingmodule.service;

import com.sliit.bookingmodule.dto.TechnicianDto;
import com.sliit.bookingmodule.entity.AppUser;
import com.sliit.bookingmodule.enums.UserRole;
import com.sliit.bookingmodule.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserDirectoryService {

    private final UserRepository userRepository;

    public UserDirectoryService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void ensureDefaultUsers() {
        if (!userRepository.findByRoleAndActiveTrue(UserRole.TECHNICIAN).isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        userRepository.saveAll(List.of(
                new AppUser("student-1", "Student User", "student@campus.edu", UserRole.STUDENT, true, now, now),
                new AppUser("admin-1", "Admin User", "admin@campus.edu", UserRole.ADMINISTRATOR, true, now, now),
                new AppUser("tech-1", "Technician User", "tech@campus.edu", UserRole.TECHNICIAN, true, now, now),
                new AppUser("tech-2", "Technician Two", "tech2@campus.edu", UserRole.TECHNICIAN, true, now, now),
                new AppUser("tech-3", "Technician Three", "tech3@campus.edu", UserRole.TECHNICIAN, true, now, now)
        ));
    }

    public List<TechnicianDto> getTechnicians() {
        return userRepository.findByRoleAndActiveTrue(UserRole.TECHNICIAN).stream()
                .map(u -> new TechnicianDto(u.getId(), u.getName(), u.getEmail()))
                .toList();
    }
}

