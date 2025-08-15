const express = require("express");
const router = express.Router();
const searchControllers = require("../controllers/searchControllers");
const { optionallyVerifyToken } = require("../middleware/auth");

// Search posts
router.get("/posts", optionallyVerifyToken, searchControllers.searchPosts);

// Search users
router.get("/users", optionallyVerifyToken, searchControllers.searchUsers);

// Search tags
router.get("/tags", optionallyVerifyToken, searchControllers.searchTags);

// Combined search (posts, users, tags)
router.get("/combined", optionallyVerifyToken, searchControllers.combinedSearch);

module.exports = router; 