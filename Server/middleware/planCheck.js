const User = require("../models/User");
const { error } = require("../utils/response");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || user.subscriptionPlan !== "pro") {
      return error(
        res,
        "This feature requires a Pro plan. Please upgrade.",
        403,
      );
    }

    next();
  } catch (err) {
    return error(res, err.message, 500);
  }
};
