package com.talenthub.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeRequest {
    @NotBlank
    private String oldPassword;

    @NotBlank
    private String newPassword;
}
