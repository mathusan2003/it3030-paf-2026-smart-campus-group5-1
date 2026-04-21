package com.sliit.bookingmodule.ai.controller;

import com.sliit.bookingmodule.ai.dto.BookingSuggestionRequest;
import com.sliit.bookingmodule.ai.dto.BookingSuggestionResponse;
import com.sliit.bookingmodule.ai.service.OllamaSuggestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final OllamaSuggestionService ollamaSuggestionService;

    public AiController(OllamaSuggestionService ollamaSuggestionService) {
        this.ollamaSuggestionService = ollamaSuggestionService;
    }

    @PostMapping("/booking-suggestions")
    @ResponseStatus(HttpStatus.OK)
    public BookingSuggestionResponse bookingSuggestions(@Valid @RequestBody BookingSuggestionRequest request) {
        String suggestion = ollamaSuggestionService.suggestBookingOptimization(request);
        return new BookingSuggestionResponse(ollamaSuggestionService.isEnabled(), suggestion);
    }
}

