package com.campus.hub.service;

import com.campus.hub.dto.NotificationDto;
import com.campus.hub.entity.Notification;
import com.campus.hub.entity.User;
import com.campus.hub.entity.enums.NotificationType;
import com.campus.hub.exception.ResourceNotFoundException;
import com.campus.hub.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public Notification createNotification(User user, String title, String message, NotificationType type, String targetUrl) {
        Notification notification = new Notification(user, title, message, type, targetUrl);
        return notificationRepository.save(notification);
    }

    private NotificationDto mapToDto(Notification notif) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notif.getId());
        dto.setUserId(notif.getUser().getId());
        dto.setTitle(notif.getTitle());
        dto.setMessage(notif.getMessage());
        dto.setType(notif.getType());
        dto.setIsRead(notif.getIsRead());
        dto.setTargetUrl(notif.getTargetUrl());
        dto.setCreatedAt(notif.getCreatedAt());
        return dto;
    }
}
