package com.zerotrust.repository;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.zerotrust.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "users";

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(firestore.collection(COLLECTION_NAME).document().getId());
        }
        firestore.collection(COLLECTION_NAME).document(user.getId()).set(user);
        return user;
    }

    public Optional<User> findByEmail(String email) {
        try {
            List<QueryDocumentSnapshot> documents = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("email", email)
                    .get()
                    .get()
                    .getDocuments();
            
            if (documents.isEmpty()) {
                return Optional.empty();
            }
            
            return Optional.of(documents.get(0).toObject(User.class));
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error fetching user from Firestore", e);
        }
    }

    public List<User> findAll() {
        try {
            return firestore.collection(COLLECTION_NAME).get().get().getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(User.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error fetching users from Firestore", e);
        }
    }

    public Optional<User> findById(String id) {
        try {
            var doc = firestore.collection(COLLECTION_NAME).document(id).get().get();
            if (doc.exists()) {
                return Optional.of(doc.toObject(User.class));
            }
            return Optional.empty();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error fetching user by ID", e);
        }
    }

    public void deleteById(String id) {
        firestore.collection(COLLECTION_NAME).document(id).delete();
    }
}
