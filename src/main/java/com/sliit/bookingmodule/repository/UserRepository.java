package com.sliit.bookingmodule.repository;

import com.sliit.bookingmodule.entity.AppUser;
import com.sliit.bookingmodule.enums.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<AppUser, String> {
    List<AppUser> findByRoleAndActiveTrue(UserRole role);
}

