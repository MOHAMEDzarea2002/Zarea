const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/auth.middleware");
const { verifyAdmin } = require("../../middleware/admin.middleware");
const { getAllUsers, updateUserRole } = require("../../controllers/user.controller");


router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.patch("/:id/role", verifyToken, verifyAdmin, updateUserRole);

module.exports = router;
