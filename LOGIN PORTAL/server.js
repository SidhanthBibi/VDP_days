const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;
const JWT_SECRET = "your_jwt_secret"; // Change this to a secure secret key

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname)); // Serve static files (HTML)

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/multi_session_login", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Session Schema
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionToken: { type: String, required: true },
  deviceInfo: { type: String },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model("Session", sessionSchema);

// Helper: Generate a JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

// Routes

// Register Route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed. User might already exist." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password, deviceInfo } = req.body;
  const ipAddress = req.ip;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate a session token
    const sessionToken = generateToken(user._id);

    // Check for existing sessions for the user
    const activeSessions = await Session.find({ userId: user._id });
    if (activeSessions.length > 0) {
      res.json({
        message: "You are already logged in on another device.",
        activeSessions,
      });
    }

    // Create a new session
    const session = new Session({
      userId: user._id,
      sessionToken,
      deviceInfo,
      ipAddress,
    });
    await session.save();

    // Send the session token as a cookie
    res.cookie("sessionToken", sessionToken, { httpOnly: true });
    res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout Route
app.post("/logout", async (req, res) => {
  const { sessionToken } = req.cookies;

  try {
    await Session.deleteOne({ sessionToken });
    res.clearCookie("sessionToken");
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
