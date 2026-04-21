package com.sliit.bookingmodule.notifications.sms;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Primary
public class NoopUserPhoneResolver implements UserPhoneResolver {
    @Override
    public Optional<String> resolvePhone(String userId) {
        return Optional.empty();
    }
}

