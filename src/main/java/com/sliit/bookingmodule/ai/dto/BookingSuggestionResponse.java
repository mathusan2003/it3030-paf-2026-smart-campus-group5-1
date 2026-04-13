package com.sliit.bookingmodule.ai.dto;

public class BookingSuggestionResponse {
    private boolean enabled;
    private String suggestion;

    public BookingSuggestionResponse() {}

    public BookingSuggestionResponse(boolean enabled, String suggestion) {
        this.enabled = enabled;
        this.suggestion = suggestion;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }
}

