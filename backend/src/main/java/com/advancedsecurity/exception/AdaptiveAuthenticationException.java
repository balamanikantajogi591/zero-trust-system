package com.advancedsecurity.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.LOCKED)
public class AdaptiveAuthenticationException extends RuntimeException {
    public AdaptiveAuthenticationException(String message) {
        super(message);
    }
}
