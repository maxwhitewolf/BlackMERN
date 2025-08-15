const express = require("express");
const router = express.Router();
const notificationControllers = require("../controllers/notificationControllers");
const { verifyToken } = require("../middleware/auth");

// Get user's notifications
router.get("/", verifyToken, notificationControllers.getUserNotifications);

// Mark notifications as read
router.patch("/mark-read", verifyToken, notificationControllers.markAsRead);

// Get unread count
router.get("/unread-count", verifyToken, notificationControllers.getUnreadCount);

// Delete a notification
router.delete("/:notificationId", verifyToken, notificationControllers.deleteNotification);

module.exports = router; 