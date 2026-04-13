package com.sliit.bookingmodule.notifications.sms;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class SmsNotificationSender {

    private final boolean enabled;
    private final String accountSid;
    private final String authToken;
    private final String fromNumber;
    private final UserPhoneResolver userPhoneResolver;

    private volatile boolean twilioInitialized = false;

    public SmsNotificationSender(
            @Value("${app.twilio.enabled:false}") boolean enabled,
            @Value("${app.twilio.account-sid:}") String accountSid,
            @Value("${app.twilio.auth-token:}") String authToken,
            @Value("${app.twilio.from-number:}") String fromNumber,
            UserPhoneResolver userPhoneResolver
    ) {
        this.enabled = enabled;
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.fromNumber = fromNumber;
        this.userPhoneResolver = userPhoneResolver;
    }

    public void sendToUserIfConfigured(String userId, String message) {
        Optional<String> to = userPhoneResolver.resolvePhone(userId);
        to.ifPresent(phone -> sendDirectIfConfigured(phone, message));
    }

    public void sendDirectIfConfigured(String toNumber, String message) {
        if (!enabled) {
            return;
        }
        if (toNumber == null || toNumber.isBlank()) {
            return;
        }
        if (accountSid == null || accountSid.isBlank() || authToken == null || authToken.isBlank() || fromNumber == null || fromNumber.isBlank()) {
            log.warn("Twilio enabled but credentials are missing; skipping SMS send.");
            return;
        }
        initTwilioOnce();
        try {
            Message.creator(new PhoneNumber(toNumber), new PhoneNumber(fromNumber), message).create();
        } catch (Exception ex) {
            log.warn("Failed to send SMS to {}: {}", toNumber, ex.getMessage());
        }
    }

    private void initTwilioOnce() {
        if (twilioInitialized) {
            return;
        }
        synchronized (this) {
            if (twilioInitialized) {
                return;
            }
            Twilio.init(accountSid, authToken);
            twilioInitialized = true;
        }
    }
}

