const Notification = require("../models/Notification");
const User = require("../models/User");

// Create a new notification
const createNotification = async (recipientId, senderId, type, postId = null, commentId = null, content = "") => {
  try {
    // Check if notification already exists (to avoid duplicates)
    const existingNotification = await Notification.findOne({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId,
      comment: commentId,
      read: false
    });

    if (existingNotification) {
      return existingNotification;
    }

    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      post: postId,
      comment: commentId,
      content,
      read: false
    });

    // Populate the notification with sender info
    const populatedNotification = await Notification.findById(notification._id)
      .populate("sender", "username avatar fullName")
      .populate("post", "title")
      .populate("comment", "content");

    // Emit real-time notification
    const { emitNotification, emitUnreadCount } = require("../socketServer");
    if (emitNotification && emitUnreadCount) {
      emitNotification(recipientId, populatedNotification);
      
      // Get updated unread count
      const unreadCount = await Notification.countDocuments({
        recipient: recipientId,
        read: false
      });
      emitUnreadCount(recipientId, unreadCount);
    }

    return populatedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get user's notifications
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username avatar fullName")
      .populate("post", "title")
      .populate("comment", "content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Notification.countDocuments({ recipient: userId });

    return res.status(200).json({
      notifications,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasMore: total > page * limit
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Mark notifications as read
const markAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    const { notificationIds } = req.body;

    if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationIds }, recipient: userId },
        { read: true }
      );
    } else {
      // Mark all notifications as read
      await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
      );
    }

    // Get updated unread count
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      read: false
    });

    // Emit updated unread count
    const { emitUnreadCount } = require("../socketServer");
    if (emitUnreadCount) {
      emitUnreadCount(userId, unreadCount);
    }

    return res.status(200).json({ 
      message: "Notifications marked as read",
      unreadCount 
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.body;

    const count = await Notification.countDocuments({
      recipient: userId,
      read: false
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(400).json({ error: error.message });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { userId } = req.body;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Get updated unread count
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      read: false
    });

    // Emit updated unread count
    const { emitUnreadCount } = require("../socketServer");
    if (emitUnreadCount) {
      emitUnreadCount(userId, unreadCount);
    }

    return res.status(200).json({ 
      message: "Notification deleted",
      unreadCount 
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  getUnreadCount,
  deleteNotification
}; 