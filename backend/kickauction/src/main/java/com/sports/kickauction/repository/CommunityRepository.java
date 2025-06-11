package com.sports.kickauction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sports.kickauction.community.Community;

public interface CommunityRepository extends JpaRepository<Community, Long> {
}
