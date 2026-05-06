package com.zerotrust.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    private String id;
    private String userId;
    private String action;
    private String details;
    private String timestamp;
    private String hash;
}
