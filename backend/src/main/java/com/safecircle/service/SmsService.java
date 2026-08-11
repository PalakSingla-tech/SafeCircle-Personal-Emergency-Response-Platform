package com.safecircle.service;

public interface SmsService {
    void sendSms(String toPhoneNumber, String message);
}
