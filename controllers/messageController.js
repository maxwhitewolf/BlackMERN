const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const { userId } = req.body;

    if (!recipientId || !content) {
      throw new Error("Recipient ID and content are required");
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      throw new Error("Recipient not found");
    }

    let conversation = await Conversation.findOne({
      recipients: {
        $all: [userId, recipientId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        recipients: [userId, recipientId],
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: userId,
      content,
    });

    conversation.lastMessageAt = Date.now();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username avatar");

    return res.json(populatedMessage);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "-password")
      .sort("-createdAt")
      .limit(50);

    return res.json(messages.reverse());
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userId } = req.body;
    const otherUserId = req.params.userId;

    if (!otherUserId) {
      throw new Error("User ID is required");
    }

    if (userId === otherUserId) {
      throw new Error("Cannot message yourself");
    }

    const conversation = await Conversation.findOne({
      recipients: {
        $all: [userId, otherUserId],
      },
    });

    if (!conversation) {
      return res.json([]);
    }

    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "username avatar")
      .sort("createdAt")
      .limit(50);

    return res.json(messages);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const { userId } = req.body;

    const conversations = await Conversation.find({
      recipients: {
        $in: [userId],
      },
    })
      .populate("recipients", "-password")
      .sort("-updatedAt")
      .lean();

    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      for (let j = 0; j < 2; j++) {
        if (conversation.recipients[j]._id != userId) {
          conversation.recipient = conversation.recipients[j];
        }
      }
    }

    return res.json(conversations);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getMessagesBetweenUsers,
  getConversations,
};
