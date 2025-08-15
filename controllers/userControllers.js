const User = require("../models/User");
const Post = require("../models/Post");
const PostLike = require("../models/PostLike");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Follow = require("../models/Follow");
const { default: mongoose } = require("mongoose");
const { createNotification } = require("./notificationControllers");

const getUserDict = (token, user) => {
  return {
    token,
    username: user.username,
    userId: user._id,
    isAdmin: user.isAdmin,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      biography: user.biography,
      avatar: user.avatar,
      website: user.website,
      location: user.location,
      isAdmin: user.isAdmin,
    },
  };
};

const buildToken = (user) => {
  return {
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      throw new Error("Email and username must be unique");
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new Error("Email or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email or password incorrect");
    }

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const follow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    if (userId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    const existingFollow = await Follow.findOne({ userId, followingId });

    if (existingFollow) {
      throw new Error("Already following this user");
    }

    const follow = await Follow.create({ userId, followingId });

    // Create notification for followed user
    await createNotification(followingId, userId, "follow");

    // Create activity for follow
    const { createActivity } = require("./activityControllers");
    await createActivity(userId, followingId, "follow");

    // Get updated user data
    const user = await User.findById(followingId).select("-password");
    const followerCount = await Follow.countDocuments({ followingId });
    const followingCount = await Follow.countDocuments({ userId: followingId });

    return res.status(200).json({ 
      success: true,
      user: {
        ...user.toObject(),
        followerCount,
        followingCount
      }
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, biography, fullName, location, website } = req.body;
    let avatar = "";

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User does not exist");
    }

    // Handle uploaded avatar file
    if (req.file) {
      // Convert buffer to base64 for storage
      const base64Image = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      avatar = `data:${mimeType};base64,${base64Image}`;
      user.avatar = avatar;
    }

    // Update other fields
    if (typeof biography === "string") {
      user.biography = biography;
    }
    if (typeof fullName === "string") {
      user.fullName = fullName;
    }
    if (typeof location === "string") {
      user.location = location;
    }
    if (typeof website === "string") {
      user.website = website;
    }

    await user.save();

    return res.status(200).json({ 
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        biography: user.biography,
        avatar: user.avatar,
        website: user.website,
        location: user.location,
        isAdmin: user.isAdmin,
      }
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unfollow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    const existingFollow = await Follow.findOne({ userId, followingId });

    if (!existingFollow) {
      throw new Error("Not already following user");
    }

    await existingFollow.deleteOne();

    // Get updated user data
    const user = await User.findById(followingId).select("-password");
    const followerCount = await Follow.countDocuments({ followingId });
    const followingCount = await Follow.countDocuments({ userId: followingId });

    return res.status(200).json({ 
      success: true,
      user: {
        ...user.toObject(),
        followerCount,
        followingCount
      }
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const followers = await Follow.find({ followingId: userId });

    return res.status(200).json({ data: followers });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const following = await Follow.find({ userId });

    return res.status(200).json({ data: following });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      throw new Error("User does not exist");
    }

    // Get follower and following counts
    const followerCount = await Follow.countDocuments({ followingId: user._id });
    const followingCount = await Follow.countDocuments({ userId: user._id });

    // Get posts
    const posts = await Post.find({ poster: user._id })
      .populate("poster", "username avatar fullName")
      .sort("-createdAt");

    let totalLikes = 0;
    posts.forEach((post) => {
      totalLikes += post.likeCount;
    });

    const data = {
      user: {
        ...user.toObject(),
        followerCount,
        followingCount,
      },
      posts: {
        count: posts.length,
        totalLikes,
        data: posts,
      },
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getRandomUsers = async (req, res) => {
  try {
    let { size } = req.query;
    const { userId } = req.body;

    // Ensure userId is provided and valid
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Valid user ID is required" });
    }

    // Get all users except the current user
    let users = await User.find({ _id: { $ne: userId } }).select("-password");

    // If no other users exist, return empty array
    if (users.length === 0) {
      return res.status(200).json([]);
    }

    const randomUsers = [];

    if (size > users.length) {
      size = users.length;
    }

    const randomIndices = getRandomIndices(size, users.length);

    for (let i = 0; i < randomIndices.length; i++) {
      const randomUser = users[randomIndices[i]];
      
      // Add follower count to each user
      const followerCount = await Follow.countDocuments({ followingId: randomUser._id });
      
      // Check if current user is following this user
      const isFollowing = await Follow.findOne({ userId, followingId: randomUser._id });
      
      const userWithCount = {
        ...randomUser.toObject(),
        followerCount,
        isFollowing: !!isFollowing
      };
      
      randomUsers.push(userWithCount);
    }

    return res.status(200).json(randomUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    // Get follower and following counts
    const followerCount = await Follow.countDocuments({ followingId: user._id });
    const followingCount = await Follow.countDocuments({ userId: user._id });

    // Get post count
    const postCount = await Post.countDocuments({ poster: user._id });

    const data = {
      ...user.toObject(),
      followerCount,
      followingCount,
      postCount,
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const { userId } = req.body;
    
    if (!q || q.length < 2) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      _id: { $ne: userId }, // Exclude current user
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } }
      ]
    })
    .select("-password")
    .limit(10);

    // Add follower counts to each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const followerCount = await Follow.countDocuments({ followingId: user._id });
        return {
          ...user.toObject(),
          followerCount
        };
      })
    );

    return res.status(200).json(usersWithCounts);
  } catch (err) {
    console.error('Search users error:', err);
    return res.status(400).json({ error: err.message });
  }
};

const getFollowStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const targetUserId = req.params.id;

    if (!userId || !targetUserId) {
      throw new Error("User IDs are required");
    }

    const follow = await Follow.findOne({ userId, followingId: targetUserId });
    const isFollowing = !!follow;

    return res.status(200).json({ isFollowing });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getRandomIndices = (size, sourceSize) => {
  const randomIndices = [];
  while (randomIndices.length < size) {
    const randomNumber = Math.floor(Math.random() * sourceSize);
    if (!randomIndices.includes(randomNumber)) {
      randomIndices.push(randomNumber);
    }
  }
  return randomIndices;
};

module.exports = {
  register,
  login,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  getCurrentUser,
  getRandomUsers,
  updateUser,
  searchUsers,
  getFollowStatus,
};
