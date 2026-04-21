package com.sliit.bookingmodule.controller;

import com.sliit.bookingmodule.dto.TechnicianDto;
import com.sliit.bookingmodule.service.UserDirectoryService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserDirectoryService userDirectoryService;

    public UserController(UserDirectoryService userDirectoryService) {
        this.userDirectoryService = userDirectoryService;
    }

    @GetMapping("/technicians")
    public List<TechnicianDto> getTechnicians() {
        return userDirectoryService.getTechnicians();
    }
}

