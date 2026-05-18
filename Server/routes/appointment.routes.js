const router = require("express").Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const c = require("../controllers/appointment.controller");

router.post("/", auth, roleCheck("admin", "receptionist", "patient"), c.bookAppointment);
router.get("/", auth, c.getAllAppointments);
router.patch("/:id/status", auth, c.updateStatus);
router.get("/schedule", auth, roleCheck("doctor"), c.getDoctorSchedule);

module.exports = router;
