const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.use(auth);

router.get(
  "/",
  roleCheck("admin", "doctor", "receptionist", "patient"),
  userController.getAllUsers,
);
router.get(
  "/:id",
  roleCheck("admin", "doctor", "receptionist", "patient"),
  userController.getUserById,
);
router.post("/", roleCheck("admin"), userController.createUser);
router.put("/:id", roleCheck("admin"), userController.updateUser);
router.delete("/:id", roleCheck("admin"), userController.deleteUser);
router.patch(
  "/admin/upgrade-plan",
  roleCheck("admin"),
  userController.upgradePlan,
);

router.patch(
  "/admin/approve-doctor/:id",
  roleCheck("admin"),
  userController.approveDoctor,
);

router.patch(
  "/admin/approve-receptionist/:id",
  roleCheck("admin"),
  userController.approveReceptionist,
);

module.exports = router;
