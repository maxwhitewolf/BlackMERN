const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");

const seedDatabase = async () => {
  try {
    console.log('🧹 Clearing all data...');
    
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    
    console.log('✅ All data cleared successfully!');
    console.log('📊 Database is now clean and ready for real users only');
    console.log('💡 Users can now register and create their own accounts');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

// Connect to MongoDB and run clearing
mongoose.connect("mongodb://localhost:27017/blanxMERN", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected for clearing...');
  seedDatabase();
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 