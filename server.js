const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const app = express();
const { authSocket, socketServer } = require("./socketServer");
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");
const activities = require("./routes/activities");
const notifications = require("./routes/notifications");
const search = require("./routes/search");
const PostLike = require("./models/PostLike");
const Post = require("./models/Post");

dotenv.config();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://post-it-heroku.herokuapp.com"],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));

// Set default TOKEN_KEY if not in environment
if (!process.env.TOKEN_KEY) {
  process.env.TOKEN_KEY = "blanxMERN_secret_token_key_2024";
}

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/blanxMERN", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected to blanxMERN database");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.log("Please make sure MongoDB is running on localhost:27017");
    console.log("You can start MongoDB with: mongod");
    console.log("Server will continue without database connection...");
  }
};

connectDB();

const PORT = process.env.PORT || 5000; // Use port 5000 for development
httpServer.listen(PORT, () => {
  const actualPort = httpServer.address().port;
  console.log(`BlanX server listening on port ${actualPort}`);
});

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Make upload available to routes
app.locals.upload = upload;

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "BlanX server is running",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Simple test route
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "BlanX API is working!",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);
app.use("/api/activities", activities);
app.use("/api/notifications", notifications);
app.use("/api/search", search);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path 
  });
});
