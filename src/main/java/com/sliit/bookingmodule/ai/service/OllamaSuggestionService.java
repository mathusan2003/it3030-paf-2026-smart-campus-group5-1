package com.sliit.bookingmodule.ai.service;

import com.sliit.bookingmodule.ai.dto.BookingSuggestionRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class OllamaSuggestionService {

    private final boolean enabled;
    private final String baseUrl;
    private final String model;
    private final RestClient restClient;

    public OllamaSuggestionService(
            @Value("${app.ollama.enabled:false}") boolean enabled,
            @Value("${app.ollama.base-url:http://localhost:11434}") String baseUrl,
            @Value("${app.ollama.model:llama3.1}") String model
    ) {
        this.enabled = enabled;
        this.baseUrl = baseUrl;
        this.model = model;
        this.restClient = RestClient.builder().baseUrl(this.baseUrl).build();
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String suggestBookingOptimization(BookingSuggestionRequest req) {
        if (!enabled) {
            return "AI suggestions are disabled. Set app.ollama.enabled=true to enable.";
        }

        String prompt = buildPrompt(req);

        // Ollama generate API (non-streaming)
        Map<String, Object> payload = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false
        );

        Map response = restClient.post()
                .uri("/api/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(Map.class);

        Object text = response == null ? null : response.get("response");
        return text == null ? "No suggestion returned from Ollama." : text.toString().trim();
    }

    private String buildPrompt(BookingSuggestionRequest req) {
        String date = req.getBookingDate() == null ? "N/A" : req.getBookingDate().format(DateTimeFormatter.ISO_DATE);
        String start = req.getStartTime() == null ? "N/A" : req.getStartTime().toString();
        String end = req.getEndTime() == null ? "N/A" : req.getEndTime().toString();

        return """
                You are an assistant for a university smart campus booking system.
                Provide concise suggestions to optimize a booking request:
                - detect potential issues (time, purpose clarity, expected attendees)
                - suggest alternative timeslot ranges (if beneficial)
                - suggest resource-fit considerations

                Booking request:
                userId: %s
                resourceId: %s
                date: %s
                start: %s
                end: %s
                expectedAttendees: %s
                purpose: %s

                Output: 3-6 bullet points, no extra preamble.
                """.formatted(
                safe(req.getUserId()),
                safe(req.getResourceId()),
                date,
                start,
                end,
                req.getExpectedAttendees() == null ? "N/A" : req.getExpectedAttendees(),
                safe(req.getPurpose())
        );
    }

    private String safe(String v) {
        return v == null ? "N/A" : v;
    }
}

