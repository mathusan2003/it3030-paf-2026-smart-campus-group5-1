package com.sliit.bookingmodule.notifications.sms;

import java.util.Optional;

public interface UserPhoneResolver {
    Optional<String> resolvePhone(String userId);
}

