const Activity = require("../models/Activity");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// Create activity
const createActivity = async (user, targetUser, type, post = null, comment = null) => {
  try {
    // Don't create activity for self
    if (user.toString() === targetUser.toString()) {
      return;
    }

    await Activity.create({
      user,
      targetUser,
      type,
      post,
      comment,
    });
  } catch (err) {
    console.error("Error creating activity:", err);
  }
};

// Get user activities
const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.body;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const activities = await Activity.find({ targetUser: userId })
      .populate("user", "username avatar fullName")
      .populate("post", "title content image")
      .populate("comment", "content")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments({ targetUser: userId });

    return res.json({
      activities,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Mark activities as read
const markActivitiesAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    const { activityIds } = req.body;

    if (activityIds && activityIds.length > 0) {
      await Activity.updateMany(
        { _id: { $in: activityIds }, targetUser: userId },
        { read: true }
      );
    } else {
      // Mark all activities as read
      await Activity.updateMany(
        { targetUser: userId, read: false },
        { read: true }
      );
    }

    return res.json({ message: "Activities marked as read" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get unread activity count
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.body;

    const count = await Activity.countDocuments({
      targetUser: userId,
      read: false,
    });

    return res.json({ count });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createActivity,
  getUserActivities,
  markActivitiesAsRead,
  getUnreadCount,
}; 