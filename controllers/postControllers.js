const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const PostLike = require("../models/PostLike");
const Follow = require("../models/Follow");
const paginate = require("../util/paginate");
const cooldown = new Set();

USER_LIKES_PAGE_SIZE = 9;

const createPost = async (req, res) => {
  try {
    const { title, content, location, tags, userId } = req.body;
    let image = req.body.image || "";

    if (!(title && content)) {
      throw new Error("Title and content are required");
    }

    if (cooldown.has(userId)) {
      throw new Error(
        "You are posting too frequently. Please try again shortly."
      );
    }

    cooldown.add(userId);
    setTimeout(() => {
      cooldown.delete(userId);
    }, 60000);

    // Handle image upload if provided
    if (req.file) {
      // For now, we'll use a placeholder image URL
      // In production, you'd upload to a service like AWS S3 or Cloudinary
      image = `https://picsum.photos/600/600?random=${Date.now()}`;
    }

    const post = await Post.create({
      title,
      content,
      image: image || "",
      location: location || "",
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(' ').filter(tag => tag.trim())) : [],
      poster: userId,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("poster", "username avatar fullName");

    res.json(populatedPost);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Post does not exist");
    }

    const post = await Post.findById(postId)
      .populate("poster", "-password")
      .lean();

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (userId) {
      await setLiked([post], userId);
    }

    await enrichWithUserLikePreview([post]);

    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, userId, isAdmin } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (post.poster != userId && !isAdmin) {
      throw new Error("Not authorized to update post");
    }

    post.content = content;
    post.edited = true;

    await post.save();

    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, isAdmin } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (post.poster != userId && !isAdmin) {
      throw new Error("Not authorized to delete post");
    }

    await post.remove();

    await Comment.deleteMany({ post: post._id });

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const setLiked = async (posts, userId) => {
  let searchCondition = {};
  if (userId) searchCondition = { userId };

  const userPostLikes = await PostLike.find(searchCondition); //userId needed

  posts.forEach((post) => {
    userPostLikes.forEach((userPostLike) => {
      if (userPostLike.postId.equals(post._id)) {
        post.liked = true;
        return;
      }
    });
  });
};

const enrichWithUserLikePreview = async (posts) => {
  const postMap = posts.reduce((result, post) => {
    result[post._id] = post;
    return result;
  }, {});

  const postLikes = await PostLike.find({
    postId: { $in: Object.keys(postMap) },
  })
    .limit(200)
    .populate("userId", "username");

  postLikes.forEach((postLike) => {
    const post = postMap[postLike.postId];
    if (!post.userLikePreview) {
      post.userLikePreview = [];
    }
    post.userLikePreview.push(postLike.userId);
  });
};

const getUserLikedPosts = async (req, res) => {
  try {
    const likerId = req.params.id;
    const { userId } = req.body;
    let { page, sortBy } = req.query;

    if (!sortBy) sortBy = "-createdAt";
    if (!page) page = 1;

    let posts = await PostLike.find({ userId: likerId })
      .sort(sortBy)
      .populate({ path: "postId", populate: { path: "poster" } })
      .lean();

    posts = paginate(posts, 10, page);

    const count = posts.length;

    let responsePosts = [];
    posts.forEach((post) => {
      responsePosts.push(post.postId);
    });

    if (userId) {
      await setLiked(responsePosts, userId);
    }

    await enrichWithUserLikePreview(responsePosts);

    return res.json({ data: responsePosts, count });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const { userId } = req.body;

    let { page, sortBy, author, search, liked } = req.query;

    if (!sortBy) sortBy = "-createdAt";
    if (!page) page = 1;

    let posts = await Post.find()
      .populate("poster", "username avatar fullName")
      .sort(sortBy)
      .lean();

    if (author) {
      posts = posts.filter((post) => post.poster.username == author);
    }

    if (search) {
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    const count = posts.length;

    posts = paginate(posts, 10, page);

    if (userId) {
      await setLiked(posts, userId);
    }

    await enrichWithUserLikePreview(posts);

    return res.json({ data: posts, count });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
};

const getHomeFeed = async (req, res) => {
  try {
    const { userId } = req.body;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      throw new Error("User ID required");
    }

    const skip = (page - 1) * limit;

    // Get users that the current user follows
    const following = await Follow.find({ userId }).select("followingId");
    const followingIds = following.map(f => f.followingId);

    // Add current user's posts to the feed
    followingIds.push(userId);

    const posts = await Post.find({ poster: { $in: followingIds } })
      .populate("poster", "username avatar fullName")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit));

    await setLiked(posts, userId);
    await enrichWithUserLikePreview(posts);

    const total = await Post.countDocuments({ poster: { $in: followingIds } });

    return res.json({
      posts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    const existingPostLike = await PostLike.findOne({ postId, userId });

    if (existingPostLike) {
      throw new Error("Post is already liked");
    }

    await PostLike.create({
      postId,
      userId,
    });

    post.likeCount = (await PostLike.find({ postId })).length;

    await post.save();

    // Create activity for like
    const { createActivity } = require("./activityControllers");
    await createActivity(userId, post.poster, "like", postId);

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post does not exist");
    }

    const existingPostLike = await PostLike.findOne({ postId, userId });

    if (!existingPostLike) {
      throw new Error("Post is already not liked");
    }

    await existingPostLike.deleteOne();

    post.likeCount = (await PostLike.find({ postId })).length;

    await post.save();

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const { anchor } = req.query;

    const postLikesQuery = PostLike.find({ postId: postId })
      .sort("_id")
      .limit(USER_LIKES_PAGE_SIZE + 1)
      .populate("userId", "username");

    if (anchor) {
      postLikesQuery.where("_id").gt(anchor);
    }

    const postLikes = await postLikesQuery.exec();

    const hasMorePages = postLikes.length > USER_LIKES_PAGE_SIZE;

    if (hasMorePages) postLikes.pop();

    const userLikes = postLikes.map((like) => {
      return {
        id: like._id,
        username: like.userId.username,
      };
    });

    return res
      .status(400)
      .json({ userLikes: userLikes, hasMorePages, success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    const { userId } = req.body;
    
    if (!q || q.length < 2) {
      return res.status(200).json([]);
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .populate("poster", "username avatar fullName")
    .sort("-createdAt")
    .limit(10)
    .lean();

    if (userId) {
      await setLiked(posts, userId);
    }

    await enrichWithUserLikePreview(posts);

    return res.status(200).json(posts);
  } catch (err) {
    console.error('Search posts error:', err);
    return res.status(400).json({ error: err.message });
  }
};

const getExplorePosts = async (req, res) => {
  try {
    const { userId } = req.body;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    // Get popular posts (most liked) for explore
    const posts = await Post.find()
      .populate("poster", "username avatar fullName")
      .sort("-likeCount -createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (userId) {
      await setLiked(posts, userId);
    }

    await enrichWithUserLikePreview(posts);

    return res.status(200).json(posts);
  } catch (err) {
    console.error('Explore posts error:', err);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getPost,
  getPosts,
  getHomeFeed,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getUserLikedPosts,
  getUserLikes,
  searchPosts,
  getExplorePosts,
};
