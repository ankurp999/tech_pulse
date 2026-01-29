const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");

// 🟢 REGISTER
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Username, email and password are required");
  }

  const userExists = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (userExists) {
    res.status(400);
    throw new Error("Email or username already exists");
  }

  await User.create({
    username,
    email,
    password
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully"
  });
});


// 🟢 LOGIN
exports.login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400);
    throw new Error("Identifier and password are required");
  }

  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier.toLowerCase() }
    ]
  }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    success: true,
    accessToken
  });
});


// 🟢 LOGOUT
exports.logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

// 🔄 REFRESH TOKEN
exports.refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error("Refresh token missing");
  }

  // Find user with this refresh token
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.status(403);
    throw new Error("Invalid refresh token");
  }

  // Verify refresh token
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, decoded) => {
      if (err || decoded.id !== user._id.toString()) {
        res.status(403);
        throw new Error("Refresh token expired or invalid");
      }

      // Generate new access token
      const newAccessToken = generateAccessToken(user._id);

      res.status(200).json({
        success: true,
        accessToken: newAccessToken
      });
    }
  );
});