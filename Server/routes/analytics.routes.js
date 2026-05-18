const router = require("express").Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const planCheck = require("../middleware/planCheck");
const c = require("../controllers/analytics.controller");

router.get("/admin", auth, roleCheck("admin"), c.adminStats);
router.get("/doctor", auth, roleCheck("doctor"), c.doctorStats);
router.get(
  "/predictive",
  auth,
  planCheck,
  roleCheck("admin"),
  c.predictiveAnalytics,
);

module.exports = router;
