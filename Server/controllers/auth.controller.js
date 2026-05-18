const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { success, error } = require("../utils/response");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, adminSecretCode, specialization, age } = req.body;
    if (!name || !email || !password || !role)
      return error(res, "All fields are required", 400);

    // Enforce Admin signup secret verification
    if (role === "admin") {
      const serverSecret = process.env.ADMIN_SIGNUP_SECRET;
      if (!adminSecretCode || adminSecretCode !== serverSecret) {
        return error(res, "Unauthorized: Invalid or missing Admin Signup Secret Code", 403);
      }
    }

    // Doctor must provide specialization
    if (role === "doctor" && !specialization) {
      return error(res, "Specialization is required for doctors", 400);
    }

    const exists = await User.findOne({ email });
    if (exists) return error(res, "Email already registered", 400);
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      phone,
      specialization: role === "doctor" ? specialization : undefined,
      age: role === "patient" ? age : undefined,
      subscriptionPlan: "free",
      clinicId: null,
    });
    return success(
      res,
      { id: user._id, name, email, role },
      "Registered successfully",
      201,
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return error(res, "Email and password are required", 400);
    const user = await User.findOne({ email });
    if (!user) return error(res, "Invalid credentials", 401);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return error(res, "Invalid credentials", 401);
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    return success(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan,
        },
      },
      "Login successful",
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    return success(res, user);
  } catch (err) {
    return error(res, err.message, 500);
  }
};
