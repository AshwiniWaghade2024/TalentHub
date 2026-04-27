package com.talenthub.backend.exception;

import com.talenthub.backend.payload.response.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle validation errors (@NotBlank, @Email etc.) 
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // Handle resource not found (RuntimeException)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<MessageResponse> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("Error: " + ex.getMessage()));
    }

    // Handle unauthorized access (403)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<MessageResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse("Access Denied: You do not have permission to perform this action."));
    }

    // Handle authentication failures (401)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<MessageResponse> handleAuthException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Unauthorized: " + ex.getMessage()));
    }

    // Catch-all for any unhandled exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("An unexpected error occurred: " + ex.getMessage()));
    }
}
