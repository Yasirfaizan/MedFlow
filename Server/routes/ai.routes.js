const router = require("express").Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const planCheck = require("../middleware/planCheck");
const c = require("../controllers/ai.controller");

router.post(
  "/symptom-check",
  auth,
  planCheck,
  roleCheck("doctor"),
  c.symptomCheck,
);
router.post("/explain-prescription", auth, planCheck, c.explainPrescription);
router.get(
  "/risk-flags/:patientId",
  auth,
  roleCheck("doctor", "admin"),
  c.getRiskFlags,
);

module.exports = router;
