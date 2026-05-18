const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { success, error } = require("../utils/response");

// Get all users (can be filtered by role)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });
    return success(res, users, "Users retrieved successfully");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Admin creates doctor/receptionist/patient users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization, phone } = req.body;
    if (!name || !email || !password || !role) {
      return error(res, "Missing required fields", 400);
    }

    const exists = await User.findOne({ email });
    if (exists) return error(res, "Email already registered", 400);

    const approvalDefaults = {
      ...(role === "doctor" ? { doctorApprovalStatus: "pending" } : {}),
      ...(role === "receptionist"
        ? { receptionistApprovalStatus: "pending" }
        : {}),
    };

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      specialization,
      phone,
      ...approvalDefaults,
    });

    return success(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
      },
      "User created successfully",
      201,
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return error(res, "User not found", 404);
    return success(res, user, "User retrieved successfully");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { name, phone, specialization, subscriptionPlan, isActive } =
      req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (specialization !== undefined) updates.specialization = specialization;
    if (subscriptionPlan !== undefined)
      updates.subscriptionPlan = subscriptionPlan;
    if (isActive !== undefined) updates.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) return error(res, "User not found", 404);
    return success(res, user, "User updated successfully");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return error(res, "User not found", 404);
    return success(res, null, "User deleted successfully");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Admin upgrade/downgrade plan
exports.upgradePlan = async (req, res) => {
  try {
    const { userId, subscriptionPlan } = req.body;
    if (!userId || !subscriptionPlan)
      return error(res, "userId and subscriptionPlan required", 400);

    const user = await User.findByIdAndUpdate(
      userId,
      { subscriptionPlan },
      { new: true },
    ).select("-password");

    if (!user) return error(res, "User not found", 404);
    return success(res, user, "Plan updated successfully");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Admin approve doctor
exports.approveDoctor = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        doctorApprovalStatus: "approved",
        isActive: true,
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) return error(res, "User not found", 404);
    return success(res, user, "Doctor approved successfully");
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// Admin approve receptionist
exports.approveReceptionist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        receptionistApprovalStatus: "approved",
        isActive: true,
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) return error(res, "User not found", 404);
    return success(res, user, "Receptionist approved successfully");
  } catch (err) {
    return error(res, err.message, 500);
  }
};
