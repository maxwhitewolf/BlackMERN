const express = require("express");
const router = express.Router();
const activityControllers = require("../controllers/activityControllers");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, activityControllers.getUserActivities);
router.post("/mark-read", verifyToken, activityControllers.markActivitiesAsRead);
router.get("/unread-count", verifyToken, activityControllers.getUnreadCount);

module.exports = router; 