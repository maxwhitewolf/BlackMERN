const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postControllers");
const { verifyToken, optionallyVerifyToken } = require("../middleware/auth");

// Specific routes first (before :id routes)
router.get("/home", verifyToken, postControllers.getHomeFeed);
router.get("/search", optionallyVerifyToken, postControllers.searchPosts);
router.get("/explore", optionallyVerifyToken, postControllers.getExplorePosts);
router.get("/saved", verifyToken, postControllers.getSavedPosts);
router.post("/saved", verifyToken, postControllers.getSavedPosts);

// Like/Save operations (before :id routes)
router.post("/like/:id", verifyToken, postControllers.likePost);
router.delete("/like/:id", verifyToken, postControllers.unlikePost);
router.post("/save/:id", verifyToken, postControllers.savePost);
router.delete("/save/:id", verifyToken, postControllers.unsavePost);

// User likes (before :id routes)
router.get("/like/:postId/users", postControllers.getUserLikes);
router.get("/liked/:id", optionallyVerifyToken, postControllers.getUserLikedPosts);

// Post creation with file upload
router.post("/", verifyToken, (req, res, next) => {
  // Use multer middleware for file upload
  const upload = req.app.locals.upload;
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, postControllers.createPost);

// Generic routes last (after all specific routes)
router.get("/", optionallyVerifyToken, postControllers.getPosts);
router.get("/:id", optionallyVerifyToken, postControllers.getPost);
router.patch("/:id", verifyToken, (req, res, next) => {
  const upload = req.app.locals.upload;
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, postControllers.updatePost);
router.delete("/:id", verifyToken, postControllers.deletePost);

module.exports = router;
