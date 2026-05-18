const router = require("express").Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const c = require("../controllers/prescription.controller");

router.post("/", auth, roleCheck("doctor"), c.createPrescription);
router.get("/my", auth, roleCheck("patient"), c.getMyPrescriptions);
router.get("/patient/:patientId", auth, c.getPatientPrescriptions);
router.get("/", auth, roleCheck("admin"), c.getAllPrescriptionsForAdmin);
router.get("/:id", auth, c.getPrescriptionById);
router.get("/:id/pdf", auth, c.downloadPDF);

module.exports = router;
