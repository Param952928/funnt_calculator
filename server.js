const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema
const userSchema = new mongoose.Schema({
  user1: String,
  user2: String,
  percentage: Number,
});

const User = mongoose.model('user', userSchema);

// Route to handle love calculation and saving details
app.post('/calculate', async (req, res) => {
  const { user1, user2 } = req.body;
  console.log("Received input:", user1, user2);
  // hello
  // Check if the combination of user1 and user2 already exists in the database
  let existingUser = await User.findOne({ user1, user2 });

  if (!existingUser) {
    existingUser = await User.findOne({ user1: user2, user2: user1 });
  }

  if (existingUser) {
    // Return the existing result if found
    return res.json({ percentage: existingUser.percentage });
  }

  // Simple love calculation logic (for demo purposes)
  const percentage = Math.floor(Math.random() * 30) + 71;

  // Save to MongoDB
  const newUser = new User({ user1, user2, percentage });
  await newUser.save();

  res.json({ percentage });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
