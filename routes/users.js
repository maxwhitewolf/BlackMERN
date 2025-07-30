const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { check } = require("express-validator");
const { verifyToken } = require("../middleware/auth");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/me", verifyToken, userControllers.getCurrentUser);
router.get("/random", userControllers.getRandomUsers);
router.get("/search", userControllers.searchUsers);
router.get("/follow-status/:id", verifyToken, userControllers.getFollowStatus);

router.get("/:username", userControllers.getUser);
router.patch("/:id", verifyToken, userControllers.updateUser);

router.post("/follow/:id", verifyToken, userControllers.follow);
router.delete("/unfollow/:id", verifyToken, userControllers.unfollow);

router.get("/followers/:id", userControllers.getFollowers);
router.get("/following/:id", userControllers.getFollowing);

module.exports = router;
