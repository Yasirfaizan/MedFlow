const router = require("express").Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const c = require("../controllers/patient.controller");

router.post("/", auth, roleCheck("admin", "receptionist"), c.createPatient);
router.get(
  "/",
  auth,
  roleCheck("admin", "doctor", "receptionist"),
  c.getAllPatients,
);
router.get("/:id", auth, c.getPatientById);
router.patch("/:id", auth, roleCheck("admin", "receptionist"), c.updatePatient);
router.get(
  "/:id/history",
  auth,
  roleCheck("admin", "doctor"),
  c.getPatientHistory,
);

module.exports = router;
