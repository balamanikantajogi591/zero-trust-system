package com.zerotrust.repository;

import com.google.cloud.firestore.Firestore;
import com.zerotrust.model.AuditLog;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class AuditLogRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "audit_logs";

    public AuditLog save(AuditLog log) {
        if (log.getId() == null) {
            log.setId(firestore.collection(COLLECTION_NAME).document().getId());
        }
        firestore.collection(COLLECTION_NAME).document(log.getId()).set(log);
        return log;
    }

    public List<AuditLog> findAll() {
        try {
            return firestore.collection(COLLECTION_NAME).get().get().getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(AuditLog.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error fetching audit logs", e);
        }
    }
}
