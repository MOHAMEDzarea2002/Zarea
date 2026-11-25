const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/auth.middleware");
const { verifyAdmin } = require("../../middleware/admin.middleware");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../../controllers/order.controller");

// ---- Clint ----
router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getMyOrders);
router.patch("/:id/cancel", verifyToken, cancelOrder);

// ---- admin ----
router.get("/all", verifyToken, verifyAdmin, getAllOrders);
router.get("/:id", verifyToken, verifyAdmin, getSingleOrder);
router.patch("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;
