const mongoose = require("mongoose");
const Post = require("./models/Post");

const replaceRandomImage = async () => {
  try {
    console.log('🔍 Finding posts with images...');
    
    // Find all posts that have images
    const postsWithImages = await Post.find({ 
      image: { $exists: true, $ne: "" } 
    });
    
    if (postsWithImages.length === 0) {
      console.log('❌ No posts with images found. Creating a new post with the Toyota Fortuner image...');
      
      // Create a new post with the Toyota Fortuner image
      const newPost = new Post({
        poster: "507f1f77bcf86cd799439011", // Placeholder ObjectId
        title: "Beautiful Toyota Fortuner",
        content: "Just captured this stunning Toyota Fortuner with its sleek white body and black roof. The perfect combination of style and functionality! 🚗✨",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        location: "City Streets",
        tags: ["toyota", "fortuner", "suv", "automotive", "luxury"]
      });
      
      await newPost.save();
      console.log('✅ Created new post with Toyota Fortuner image!');
      return;
    }
    
    // Select a random post with image
    const randomIndex = Math.floor(Math.random() * postsWithImages.length);
    const randomPost = postsWithImages[randomIndex];
    
    console.log(`🎯 Selected post: "${randomPost.title}" (ID: ${randomPost._id})`);
    
    // Toyota Fortuner image URL (high-quality automotive image)
    const toyotaFortunerImage = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
    
    // Update the post with new image and content
    await Post.findByIdAndUpdate(randomPost._id, {
      image: toyotaFortunerImage,
      title: "Beautiful Toyota Fortuner",
      content: "Just captured this stunning Toyota Fortuner with its sleek white body and black roof. The perfect combination of style and functionality! 🚗✨",
      location: "City Streets",
      tags: ["toyota", "fortuner", "suv", "automotive", "luxury"],
      edited: true
    });
    
    console.log('✅ Successfully replaced image with Toyota Fortuner!');
    console.log(`📝 Updated post title: "Beautiful Toyota Fortuner"`);
    console.log(`🖼️ New image URL: ${toyotaFortunerImage}`);
    
  } catch (error) {
    console.error('❌ Error replacing image:', error);
  }
};

// Connect to MongoDB and run the replacement
mongoose.connect("mongodb://localhost:27017/blanxMERN", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected for image replacement...');
  replaceRandomImage().then(() => {
    console.log('🎉 Image replacement completed!');
    process.exit(0);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 