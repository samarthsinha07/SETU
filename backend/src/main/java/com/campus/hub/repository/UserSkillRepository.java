package com.campus.hub.repository;

import com.campus.hub.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserId(Long userId);
    void deleteByUserIdAndSkillId(Long userId, Long skillId);
}
