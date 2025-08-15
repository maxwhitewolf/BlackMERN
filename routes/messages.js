const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, messageController.getConversations);
router.post("/", verifyToken, messageController.sendMessage);
router.get("/conversation/:id", verifyToken, messageController.getMessages);
router.get("/user/:userId", verifyToken, messageController.getMessagesBetweenUsers);
router.post("/user/:userId", verifyToken, messageController.getMessagesBetweenUsers);

module.exports = router;
