const Post = require("../models/Post");
const User = require("../models/User");
const { setLiked, setSaved, enrichWithUserLikePreview } = require("./postControllers");

// Search posts by content, title, and tags
const searchPosts = async (req, res) => {
  try {
    const { q, page = 1, limit = 20, sortBy = "relevance" } = req.query;
    const { userId } = req.body;
    
    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        posts: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0,
        hasMore: false
      });
    }

    const skip = (page - 1) * limit;
    const searchQuery = q.trim();

    // Build search query
    const searchConditions = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } }
      ]
    };

    // Get total count
    const total = await Post.countDocuments(searchConditions);

    // Build sort conditions
    let sortCondition = {};
    switch (sortBy) {
      case "relevance":
        // Sort by text score (if using text index) or by date
        sortCondition = { createdAt: -1 };
        break;
      case "likes":
        sortCondition = { likeCount: -1, createdAt: -1 };
        break;
      case "comments":
        sortCondition = { commentCount: -1, createdAt: -1 };
        break;
      case "date":
        sortCondition = { createdAt: -1 };
        break;
      default:
        sortCondition = { createdAt: -1 };
    }

    // Execute search
    const posts = await Post.find(searchConditions)
      .populate("poster", "username avatar fullName")
      .sort(sortCondition)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add user-specific data (likes, saves)
    if (userId) {
      await setLiked(posts, userId);
      await setSaved(posts, userId);
    }

    await enrichWithUserLikePreview(posts);

    return res.status(200).json({
      posts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasMore: total > page * limit
    });
  } catch (err) {
    console.error('Search posts error:', err);
    return res.status(400).json({ error: err.message });
  }
};

// Search users by username and full name
const searchUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const { userId } = req.body;
    
    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        users: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0,
        hasMore: false
      });
    }

    const skip = (page - 1) * limit;
    const searchQuery = q.trim();

    // Build search query
    const searchConditions = {
      _id: { $ne: userId }, // Exclude current user
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { fullName: { $regex: searchQuery, $options: 'i' } }
      ]
    };

    // Get total count
    const total = await User.countDocuments(searchConditions);

    // Execute search
    const users = await User.find(searchConditions)
      .select("-password")
      .sort({ username: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add follower counts and follow status
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const followerCount = await require("../models/Follow").countDocuments({ followingId: user._id });
        const followingCount = await require("../models/Follow").countDocuments({ userId: user._id });
        const postCount = await Post.countDocuments({ poster: user._id });
        
        // Check if current user is following this user
        const isFollowing = userId ? await require("../models/Follow").findOne({ userId, followingId: user._id }) : null;
        
        return {
          ...user,
          followerCount,
          followingCount,
          postCount,
          isFollowing: !!isFollowing
        };
      })
    );

    return res.status(200).json({
      users: usersWithCounts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      hasMore: total > page * limit
    });
  } catch (err) {
    console.error('Search users error:', err);
    return res.status(400).json({ error: err.message });
  }
};

// Search tags/hashtags
const searchTags = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length < 1) {
      return res.status(200).json({
        tags: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0,
        hasMore: false
      });
    }

    const skip = (page - 1) * limit;
    const searchQuery = q.trim();

    // Aggregate to get unique tags with counts
    const tags = await Post.aggregate([
      { $unwind: "$tags" },
      { $match: { tags: { $regex: searchQuery, $options: 'i' } } },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
          recentPosts: { $push: "$$ROOT" }
        }
      },
      { $sort: { count: -1, _id: 1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ]);

    // Get total count of unique tags
    const total = await Post.aggregate([
      { $unwind: "$tags" },
      { $match: { tags: { $regex: searchQuery, $options: 'i' } } },
      { $group: { _id: "$tags" } },
      { $count: "total" }
    ]);

    const totalCount = total.length > 0 ? total[0].total : 0;

    return res.status(200).json({
      tags: tags.map(tag => ({
        name: tag._id,
        count: tag.count,
        recentPosts: tag.recentPosts.slice(0, 3) // Get 3 most recent posts
      })),
      total: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      hasMore: totalCount > page * limit
    });
  } catch (err) {
    console.error('Search tags error:', err);
    return res.status(400).json({ error: err.message });
  }
};

// Combined search (posts, users, tags)
const combinedSearch = async (req, res) => {
  try {
    const { q, type = "all", page = 1, limit = 10 } = req.query;
    const { userId } = req.body;
    
    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        posts: [],
        users: [],
        tags: [],
        total: 0
      });
    }

    const searchQuery = q.trim();
    const results = {};

    // Search posts
    if (type === "all" || type === "posts") {
      const posts = await Post.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { content: { $regex: searchQuery, $options: 'i' } },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } }
        ]
      })
      .populate("poster", "username avatar fullName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

      if (userId) {
        await setLiked(posts, userId);
        await setSaved(posts, userId);
      }
      await enrichWithUserLikePreview(posts);
      
      results.posts = posts;
    }

    // Search users
    if (type === "all" || type === "users") {
      const users = await User.find({
        _id: { $ne: userId },
        $or: [
          { username: { $regex: searchQuery, $options: 'i' } },
          { fullName: { $regex: searchQuery, $options: 'i' } }
        ]
      })
      .select("-password")
      .limit(5)
      .lean();

      results.users = users;
    }

    // Search tags
    if (type === "all" || type === "tags") {
      const tags = await Post.aggregate([
        { $unwind: "$tags" },
        { $match: { tags: { $regex: searchQuery, $options: 'i' } } },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      results.tags = tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }));
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error('Combined search error:', err);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  searchPosts,
  searchUsers,
  searchTags,
  combinedSearch
}; 