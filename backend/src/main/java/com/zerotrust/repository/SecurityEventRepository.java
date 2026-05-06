package com.zerotrust.repository;

import com.google.cloud.firestore.Firestore;
import com.zerotrust.model.SecurityEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class SecurityEventRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "security_events";

    public SecurityEvent save(SecurityEvent event) {
        if (event.getId() == null) {
            event.setId(firestore.collection(COLLECTION_NAME).document().getId());
        }
        firestore.collection(COLLECTION_NAME).document(event.getId()).set(event);
        return event;
    }

    public List<SecurityEvent> findAll() {
        try {
            return firestore.collection(COLLECTION_NAME).get().get().getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(SecurityEvent.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error fetching security events", e);
        }
    }

    public List<SecurityEvent> findBySeverity(String severity) {
        try {
            return firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("severity", severity)
                    .get()
                    .get()
                    .getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(SecurityEvent.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error fetching security events by severity", e);
        }
    }

    public Optional<SecurityEvent> findById(String id) {
        try {
            var doc = firestore.collection(COLLECTION_NAME).document(id).get().get();
            if (doc.exists()) {
                return Optional.of(doc.toObject(SecurityEvent.class));
            }
            return Optional.empty();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error fetching security event by ID", e);
        }
    }
}
