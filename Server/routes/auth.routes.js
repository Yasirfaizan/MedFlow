const router = require("express").Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      data: errors.array(),
    });
  }
  next();
};

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 8 }).withMessage("Password min 8 chars"),
    body("role")
      .isIn(["admin", "doctor", "receptionist", "patient"])
      .withMessage("Valid role required"),
  ],
  validate,
  register,
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  login,
);

router.get("/me", auth, getMe);

module.exports = router;
