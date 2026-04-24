package com.quickdoor.backend.repository;

import com.quickdoor.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}